import { Router, Request, Response, NextFunction } from "express"
import { errorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { authValidator, emailValidator, loginValidator, passwordValidator } from '../users/middlewares/userValidators';
import { authController } from "./authController"
import { tokenAuthMiddleware } from "./middlewares/tokenAuthMiddleware"
import { refreshTokenValidator } from "./middlewares/refreshTokenMiddleware"
import { rateLimit } from "express-rate-limit"

const limiter1 = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: '1You have exceeded the number of allowed requests. Please try again later.'
  },
  handler: (req: Request, res: Response, next: NextFunction) => {
    // Обработчик для кода 429
    res.status(429).json('1You have exceeded the number of allowed requests. Please try again later.')
  }
})
const limiter2 = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: '2You have exceeded the number of allowed requests. Please try again later.'
  },
  handler: (req: Request, res: Response, next: NextFunction) => {
    // Обработчик для кода 429
    res.status(429).json('2You have exceeded the number of allowed requests. Please try again later.')
  }
})
const limiter3 = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: '3You have exceeded the number of allowed requests. Please try again later.'
  },
  handler: (req: Request, res: Response, next: NextFunction) => {
    // Обработчик для кода 429
    res.status(429).json('3You have exceeded the number of allowed requests. Please try again later.')
  }
})
const limiter4 = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: '4You have exceeded the number of allowed requests. Please try again later.'
  },
  handler: (req: Request, res: Response, next: NextFunction) => {
    // Обработчик для кода 429
    res.status(429).json('4You have exceeded the number of allowed requests. Please try again later.')
  }
})

export const authRouter = Router()

authRouter.post('/login',
  limiter1, authValidator, errorResultMiddleware,
  authController.login)

authRouter.post('/logout',
  refreshTokenValidator, errorResultMiddleware,
  authController.logout)

authRouter.post('/registration',
  limiter2, loginValidator, passwordValidator, emailValidator, errorResultMiddleware,
  authController.register)

authRouter.post('/registration-confirmation',
  limiter3, errorResultMiddleware,
  authController.confirmRegistration)

authRouter.post('/registration-email-resending',
  limiter4, errorResultMiddleware,
  authController.resendEmailConfirmation)

authRouter.get('/me',
  tokenAuthMiddleware, errorResultMiddleware,
  authController.getLoggedUserInfo)

authRouter.post('/refresh-token',
  refreshTokenValidator, errorResultMiddleware,
  authController.refreshTokens)