import { Request, Response } from 'express'
import { LoginInputModel, UserInputModel } from '../../types/input-output-types/user-types'
import { UsersQueryRepository } from '../users/usersQueryRepository';
import { HttpStatuses, OutputErrorsType, ResultStatus } from '../../types/input-output-types/output-errors-type';
import { AuthService } from './authService';
import { UsersService } from '../users/usersService'
import { PasswordService } from '../other/passwordService';
import { EmailService } from '../other/emailService';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthController {

  constructor(
    @inject(AuthService) protected authService: AuthService,
    @inject(UsersService) protected usersService: UsersService,
    @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
    @inject(PasswordService) protected passwordService: PasswordService,
    @inject(EmailService) protected emailService: EmailService
  ){}
  async login(
    req: Request<LoginInputModel>,
    res: Response<OutputErrorsType | { accessToken: string }>
  ) {

    let errors: OutputErrorsType = { errorsMessages: [] }
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
    console.log('user', user);

    if (!user) {
      errors.errorsMessages.push({ message: "Incorrect Login or Email", field: 'loginOrEmail' })

      res.status(HttpStatuses.Unauthorized).send(errors)
      return
    }

    const isPasswordValid = await this.passwordService.validatePassword(req.body.password, user.password)
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      errors.errorsMessages.push({ message: "Incorrect Password", field: 'password' })

      res.status(HttpStatuses.Unauthorized).send(errors)
      return
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '1'
    const title = req.headers['user-agent'] || 'Device Name Placeholder'

    const tokens = await this.authService.createTokens({ id: user.id.toString(), login: user.login, ip: ip.toString(), title: title })
    console.log('tokens', tokens.data)
    if (tokens.status !== ResultStatus.Success || tokens.data === null) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    res.cookie('refreshToken', tokens.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    })

    res.status(HttpStatuses.Success).json({ accessToken: tokens.data!.accessToken })
    return
  }

  async refreshTokens(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken

    if (!currentRefreshToken) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    const validToken = await this.authService.findRefreshToken(currentRefreshToken)
    console.log(validToken, 'refreshTokens validToken'); //null

    if (!validToken) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    const tokens = await this.authService.refreshTokens(currentRefreshToken)

    res.cookie('refreshToken', tokens!.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });

    res.status(HttpStatuses.Success).json({ accessToken: tokens!.accessToken })
  }

  async logout(req: Request, res: Response) {
    const refreshToken: string = req.cookies.refreshToken
    console.log(refreshToken, 'refreshToken logout')
    const validToken = await this.authService.findDeviceInfo(refreshToken)
    if (!refreshToken || !validToken) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    console.log(validToken, 'validToken logout');
    const deletedToken = await this.authService.deleteRefreshToken(validToken)
    if (!deletedToken) {
      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    res.clearCookie('refreshToken')
    res.sendStatus(HttpStatuses.NoContent)
    return
  }

  async getLoggedUserInfo(req: Request, res: Response) {
    console.log(req.userId, req.userLogin, 'getLoggedUserInfo');

    const user = await this.usersQueryRepository.findById(req.userId!)
    if (!user) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.status(HttpStatuses.Success).json({
      userId: user.id,
      login: user.login,
      email: user.email
    })
  }

  async register(req: Request<UserInputModel>, res: Response) {
    console.log('here 2 register');
    const result = await this.usersService.createUser(req.body)
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatuses.ServerError)
      return
    }
    console.log(result);
    
    const newUser = await this.usersQueryRepository.findById(result.data!.userId)
    console.log(newUser?.id);
    if (!newUser) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    const userInfo = await this.usersService.findConfirmationInfo(newUser.id)
    console.log(userInfo);
    if (!userInfo) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    const messageId = await this.emailService.sendEmail(newUser.email, userInfo.emailConfirmation.confirmationCode, this.emailService.emailExamples.registrationEmail)
    console.log(messageId);
    if (!messageId) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }

  async confirmRegistration(req: Request<{ code: string }>, res: Response) {
    console.log(req.query.code, 'confirmRegistration req.query.code');
    console.log(req.body.code, 'confirmRegistration req.body.code');
    const confirmCode = req.query.code ? req.query.code.toString() : req.body.code.toString()
    const result = await this.emailService.confirmEmail(confirmCode.toString())
    console.log(result, 'result confirmRegistration authController');

    if (result.status !== ResultStatus.Success) {
      res.status(HttpStatuses.BadRequest).json({ errorsMessages: result.extensions })
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }

  async resendEmailConfirmation(req: Request<{ email: string }>, res: Response) {
    const result = await this.emailService.resendConfirmation(req.body.email)
    if (result.status !== ResultStatus.Success) {
      res.status(HttpStatuses.BadRequest).json({ errorsMessages: result.extensions })
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }

  async passwordRecovery(req: Request<{ email: string }>, res: Response) {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(req.body.email)
    if(!user) {
      res.sendStatus(HttpStatuses.NoContent)
      return
    }
    const code = await this.passwordService.createRecoveryCode(user.id)
    if (code.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    const result = await this.emailService.sendEmail(req.body.email, code.data, this.emailService.emailExamples.passwordRecoveryEmail)
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }

  async newPassword(req: Request<{ newPassword: string, recoveryCode: string }>, res: Response) {
    const result = await this.passwordService.confirmPassword(req.body.recoveryCode)
    console.log('newPassword', result);
    
    if (result.status !== ResultStatus.Success || result.data == null) {
      res.status(HttpStatuses.BadRequest).json({ errorsMessages: result.extensions })
      return
    }

    const rest = await this.passwordService.changePassword(result.data.userId.toString(), req.body.newPassword)
    console.log('changePassword', rest);
    await this.passwordService.deleteRecoveryCode(req.body.recoveryCode)

    res.sendStatus(HttpStatuses.NoContent)
    return
  }
}