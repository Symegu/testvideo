import { Request, Response } from 'express'
import { LoginInputModel } from '../../types/input-output-types/user-types'
import { usersQueryRepository } from '../users/usersQueryRepository';
import { OutputErrorsType } from '../../types/input-output-types/output-errors-type'
import { authQueryRepository } from './authQueryRepository'

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

    const isPasswordValid = await authQueryRepository.validatePassword(req.body.password, user.password)
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      errors.errorsMessages.push({ message: "Incorrect Password", field: 'password' })
      res.status(401).send(errors)
      return
    }

    const accessToken = await authQueryRepository.generateToken(usersQueryRepository.mapUserToOutput(user))
    console.log('accessToken', accessToken)
    
    res.status(200).send(accessToken)
    return 
  },

  async getUserInfo(req: Request, res: Response) {
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
  }
}