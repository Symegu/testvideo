import { Router } from "express"
import { errorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { authValidator, emailValidator, loginValidator, passwordValidator } from "../users/middlewares/userValidators"
import { authController } from "./authController"
import { tokenAuthMiddleware } from "../../globalMiddlewares/tokenAuthMiddleware"

export const authRouter = Router()

authRouter.post('/login', 
  authValidator, errorResultMiddleware, 
  authController.login)

authRouter.post('/registration', 
  loginValidator, passwordValidator, emailValidator, errorResultMiddleware,
  authController.register)

authRouter.post('/registration-confirmation', errorResultMiddleware, authController.confirmRegistration)
authRouter.post('/registration-email-resending', emailValidator, errorResultMiddleware, authController.resendEmailConfirmation)
authRouter.get('/me', tokenAuthMiddleware, errorResultMiddleware, authController.getLoggedUserInfo)