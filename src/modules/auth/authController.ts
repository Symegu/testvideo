import { Request, Response } from 'express'
import { LoginInputModel, UserInputModel } from '../../types/input-output-types/user-types'
import { usersQueryRepository } from '../users/usersQueryRepository';
import { HttpStatuses, OutputErrorsType, ResultStatus } from '../../types/input-output-types/output-errors-type';
import { authService, emailExamples } from './authService'
import { usersService } from '../users/usersService'


export const authController = {
  async login(req: Request<LoginInputModel>, res: Response) {

    let errors: OutputErrorsType = { errorsMessages: [] }
    const user = await usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
    console.log('user', user);

    if (!user) {
      errors.errorsMessages.push({ message: "Incorrect Login or Email", field: 'loginOrEmail' })

      res.status(401).send(errors)
      return
    }

    const isPasswordValid = await authService.validatePassword(req.body.password, user.password)
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      errors.errorsMessages.push({ message: "Incorrect Password", field: 'password' })
      res.status(401).send(errors)
      return
    }

    const accessToken = await authService.generateToken(usersQueryRepository.mapUserToOutput(user))
    console.log('accessToken', accessToken)

    res.status(200).json({ accessToken: accessToken })
    return
  },

  async getLoggedUserInfo(req: Request, res: Response) {
    console.log(req.userId, req.userLogin);

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
    return
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
    const userInfo = await authService.findConfirmationInfo(newUser.id)

    if(!userInfo) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    const messageId = authService.sendEmail(newUser.email, userInfo.emailConfirmation.confirmationCode, emailExamples.registrationEmail)
    if(!messageId) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    
    res.sendStatus(HttpStatuses.NoContent)
    return
  },

  async confirmRegistration(req: Request<{code: string}>, res:Response) {
    console.log(req.query.code, 'confirmRegistration req.query.code');
    console.log(req.body.code, 'confirmRegistration req.body.code');
    const confirmCode = req.query.code ? req.query.code.toString() : req.body.code.toString()
    const result = await authService.confirmEmail(confirmCode.toString())
    console.log(result, 'result confirmRegistration authController');
    
    if(result.status !== ResultStatus.Success) {
      res.status(HttpStatuses.BadRequest).json({errorsMessages:result.extensions})
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  },

  async resendEmailConfirmation(req: Request<{email: string}>, res: Response) {
    const result = await authService.resendConfirmation(req.body.email)
    if(result.status !== ResultStatus.Success) {
      res.status(HttpStatuses.BadRequest).json({errorsMessages:result.extensions})
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }
}