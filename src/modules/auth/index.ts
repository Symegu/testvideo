import { Router } from "express"
import { errorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { authValidator } from "../users/middlewares/userValidators"
import { authController } from "./authController"
import { tokenAuthMiddleware } from "../../globalMiddlewares/tokenAuthMiddleware"

export const authRouter = Router()

authRouter.post('/login', authValidator, errorResultMiddleware, authController.login)
authRouter.get('/me', tokenAuthMiddleware, errorResultMiddleware, authController.getUserInfo)