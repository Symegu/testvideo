import { Router } from 'express'
import { deleteAllDataController } from './deleteAllDataController'
import { authController } from './authController'
import { authValidator } from '../users/middlewares/userValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'

export const testingRouter = Router()

testingRouter.delete('/', deleteAllDataController)

export const authRouter = Router()

authRouter.post('/login', authValidator, errorResultMiddleware, authController.login)