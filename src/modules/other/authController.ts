import { Request, Response } from 'express'
import { LoginInputModel } from '../../input-output-types/user-types'
import { usersQueryRepository } from '../users/usersQueryRepository'
import { OutputErrorsType } from '../../input-output-types/output-errors-type'
import { authQueryRepository } from './authQueryRepository'
export const authController = {
  async login(req: Request<LoginInputModel>, res: Response) {
    
    let errors: OutputErrorsType = { errorsMessages: [] }
    const user = await usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
    
    if (!user) {
      errors.errorsMessages.push({ message: "Incorrect Login or Email", field: 'loginOrEmail' })
      
      res.status(401).send(errors)
      return 
    }

    const isPasswordValid = await authQueryRepository.validatePassword(req.body.password, user.password)

    if (!isPasswordValid) {
      errors.errorsMessages.push({ message: "Incorrect Password", field: 'password' })
      res.status(401).send(errors)
      return
    }

    res.sendStatus(204)
    return
  }
}