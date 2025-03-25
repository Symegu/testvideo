import { Router } from "express"
import { CommentsController } from "./commentsController"
import { TokenAuthMiddleware } from "../auth/middlewares/tokenAuthMiddleware"
import { commentContentValidator } from "./middlewares/commentsValidators"
import { ErrorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { container } from "../other/composition-root"

const commentsController = container.get(CommentsController)
const tokenAuthMiddleware = container.get(TokenAuthMiddleware)
const errorResultMiddleware = container.get(ErrorResultMiddleware)

export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getComment)
commentsRouter.put('/:id',
  tokenAuthMiddleware.tokenAuthMiddleware,
  commentContentValidator,
  errorResultMiddleware.errorResultMiddleware,
  commentsController.changeComment.bind(commentsController))
commentsRouter.delete('/:id',
  tokenAuthMiddleware.tokenAuthMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  commentsController.deleteComment.bind(commentsController))