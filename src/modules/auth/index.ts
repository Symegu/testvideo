import { Router, Request, Response, NextFunction } from "express"
import { ErrorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { authValidator, emailValidator, loginValidator, passwordValidator } from '../users/middlewares/userValidators';
import { AuthController } from "./authController"
import { TokenAuthMiddleware } from "./middlewares/tokenAuthMiddleware"
import { RefreshTokenValidator } from "./middlewares/refreshTokenMiddleware"
import { rateLimit } from "express-rate-limit"
import { container } from "../other/composition-root";

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
const limiter5 = rateLimit({
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
const limiter6 = rateLimit({
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

const authController = container.get(AuthController)
const tokenAuthMiddleware = container.get(TokenAuthMiddleware)
const refreshTokenValidator = container.get(RefreshTokenValidator)
const errorResultMiddleware = container.get(ErrorResultMiddleware)

export const authRouter = Router()

authRouter.post('/login',
  limiter1,
  authValidator,
  errorResultMiddleware.errorResultMiddleware,
  authController.login.bind(authController))

authRouter.post('/logout',
  refreshTokenValidator.refreshTokenValidator,
  errorResultMiddleware.errorResultMiddleware,
  authController.logout.bind(authController))

authRouter.post('/registration',
  limiter2,
  loginValidator,
  passwordValidator,
  emailValidator,
  errorResultMiddleware.errorResultMiddleware,
  authController.register.bind(authController))

authRouter.post('/registration-confirmation',
  limiter3,
  errorResultMiddleware.errorResultMiddleware,
  authController.confirmRegistration.bind(authController))

authRouter.post('/registration-email-resending',
  limiter4,
  errorResultMiddleware.errorResultMiddleware,
  authController.resendEmailConfirmation.bind(authController))

authRouter.post('/password-recovery',
  limiter5,
  errorResultMiddleware.errorResultMiddleware,
  authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
  limiter6,
  passwordValidator,
  errorResultMiddleware.errorResultMiddleware,
  authController.newPassword.bind(authController))

authRouter.get('/me',
  tokenAuthMiddleware.tokenAuthMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  authController.getLoggedUserInfo.bind(authController))

authRouter.post('/refresh-token',
  refreshTokenValidator.refreshTokenValidator,
  errorResultMiddleware.errorResultMiddleware,
  authController.refreshTokens.bind(authController))