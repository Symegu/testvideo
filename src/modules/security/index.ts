import { Router } from "express"
import { RefreshTokenValidator } from "../auth/middlewares/refreshTokenMiddleware"
import { ErrorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { SecurityController } from "./securityController"
import { container } from "../other/composition-root"

const securityController = container.get(SecurityController)
const refreshTokenValidator = container.get(RefreshTokenValidator)
const errorResultMiddleware = container.get(ErrorResultMiddleware)

export const securityRouter = Router()

securityRouter.get('/devices',
  refreshTokenValidator.refreshTokenValidator,
  errorResultMiddleware.errorResultMiddleware,
  securityController.getUserSessions.bind(securityController))
securityRouter.delete('/devices',
  refreshTokenValidator.refreshTokenValidator,
  errorResultMiddleware.errorResultMiddleware,
  securityController.deleteAllUserSessions.bind(securityController))
securityRouter.delete('/devices/:id',
  refreshTokenValidator.refreshTokenValidator,
  errorResultMiddleware.errorResultMiddleware,
  securityController.deleteUserSession.bind(securityController))