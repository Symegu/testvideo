import { Router } from "express";
import { commentsController } from "./commentsController";
import { tokenAuthMiddleware } from "../../globalMiddlewares/tokenAuthMiddleware";

export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getComment)
commentsRouter.put('/:id', tokenAuthMiddleware, commentsController.changeComment)
commentsRouter.delete('/:id', tokenAuthMiddleware, commentsController.deleteComment)