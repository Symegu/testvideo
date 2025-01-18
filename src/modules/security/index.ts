import { Router } from "express";
import { refreshTokenValidator } from "../auth/middlewares/refreshTokenMiddleware";
import { errorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware";
import { securityController } from "./securityController";

export const securityRouter = Router()

securityRouter.get('/devices',
  refreshTokenValidator,
  errorResultMiddleware,
  securityController.getUserSessions)
securityRouter.delete('/devices',
  refreshTokenValidator,
  errorResultMiddleware,
  securityController.deleteAllUserSessions)
securityRouter.delete('/devices/:id',
  refreshTokenValidator,
  errorResultMiddleware,
  securityController.deleteUserSession)