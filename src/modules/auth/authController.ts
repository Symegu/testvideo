import { Request, Response } from 'express'
import { LoginInputModel, UserInputModel } from '../../types/input-output-types/user-types'
import { usersQueryRepository } from '../users/usersQueryRepository';
import { HttpStatuses, OutputErrorsType, ResultStatus } from '../../types/input-output-types/output-errors-type';
import { authService } from './authService';
import { usersService } from '../users/usersService'
import { passwordService } from '../other/passwordService';
import { emailExamples, emailService } from '../other/emailService';


export const authController = {
  async login(
    req: Request<LoginInputModel>,
    res: Response<OutputErrorsType | { accessToken: string }>
  ) {

    let errors: OutputErrorsType = { errorsMessages: [] }
    const user = await usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
    console.log('user', user);

    if (!user) {
      errors.errorsMessages.push({ message: "Incorrect Login or Email", field: 'loginOrEmail' })

      res.status(HttpStatuses.Unauthorized).send(errors)
      return
    }

    const isPasswordValid = await passwordService.validatePassword(req.body.password, user.password)
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      errors.errorsMessages.push({ message: "Incorrect Password", field: 'password' })

      res.status(HttpStatuses.Unauthorized).send(errors)
      return
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '1'
    const title = req.headers['user-agent'] || 'Device Name Placeholder'

    const tokens = await authService.createTokens({ id: user._id.toString(), login: user.login, ip: ip.toString(), title: title })
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

    res.status(200).json({ accessToken: tokens.data!.accessToken })
    return
  },

  async refreshTokens(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken

    if (!currentRefreshToken) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    const validToken = await authService.findRefreshToken(currentRefreshToken)
    console.log(validToken, 'refreshTokens validToken'); //null

    if (!validToken) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    const tokens = await authService.refreshTokens(currentRefreshToken)

    res.cookie('refreshToken', tokens!.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });

    res.status(200).json({ accessToken: tokens!.accessToken })
  },

  async logout(req: Request, res: Response) {
    const refreshToken: string = req.cookies.refreshToken
    console.log(refreshToken, 'refreshToken logout')
    const validToken = await authService.findDeviceInfo(refreshToken)
    if (!refreshToken || !validToken) {

      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    console.log(validToken, 'validToken logout');
    const deletedToken = await authService.deleteRefreshToken(validToken)
    if (!deletedToken) {
      res.sendStatus(401)
      return
    }
    res.clearCookie('refreshToken')
    res.sendStatus(204)
    return
  },
  async getLoggedUserInfo(req: Request, res: Response) {
    console.log(req.userId, req.userLogin, 'getLoggedUserInfo');

    const user = await usersQueryRepository.findById(req.userId!)
    if (!user) {
      res.sendStatus(404)
      return
    }

    res.status(200).json({
      userId: user.id,
      login: user.login,
      email: user.email
    })
  },

  async register(req: Request<UserInputModel>, res: Response) {
    const result = await usersService.createUser(req.body)
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatuses.ServerError)
      return
    }
    const newUser = await usersQueryRepository.findById(result.data!.userId)

    if (!newUser) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    const userInfo = await usersService.findConfirmationInfo(newUser.id)

    if (!userInfo) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    const messageId = emailService.sendEmail(newUser.email, userInfo.emailConfirmation.confirmationCode, emailExamples.registrationEmail)
    if (!messageId) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  },

  async confirmRegistration(req: Request<{ code: string }>, res: Response) {
    console.log(req.query.code, 'confirmRegistration req.query.code');
    console.log(req.body.code, 'confirmRegistration req.body.code');
    const confirmCode = req.query.code ? req.query.code.toString() : req.body.code.toString()
    const result = await emailService.confirmEmail(confirmCode.toString())
    console.log(result, 'result confirmRegistration authController');

    if (result.status !== ResultStatus.Success) {
      res.status(HttpStatuses.BadRequest).json({ errorsMessages: result.extensions })
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  },

  async resendEmailConfirmation(req: Request<{ email: string }>, res: Response) {
    const result = await emailService.resendConfirmation(req.body.email)
    if (result.status !== ResultStatus.Success) {
      res.status(HttpStatuses.BadRequest).json({ errorsMessages: result.extensions })
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }
}