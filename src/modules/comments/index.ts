import { Router } from "express";
import { commentsController } from "./commentsController";
import { tokenAuthMiddleware } from "../auth/middlewares/tokenAuthMiddleware";
import { commentContentValidator } from "./middlewares/commentsValidators";
import { errorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware";

export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getComment)
commentsRouter.put('/:id',
  tokenAuthMiddleware,
  commentContentValidator,
  errorResultMiddleware,
  commentsController.changeComment)
commentsRouter.delete('/:id',
  tokenAuthMiddleware,
  errorResultMiddleware,
  commentsController.deleteComment)