import { Router } from "express"
import { CommentsController } from "./commentsController"
import { TokenAuthMiddleware } from "../auth/middlewares/tokenAuthMiddleware"
import { OptionalAccessTokenMiddleware } from "../auth/middlewares/optionalAccessTokenMiddleware"
import { ErrorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { container } from "../other/composition-root"
import { commentContentValidator } from "./middlewares/commentsValidators"
import { likeStatusValidator } from "../likes/middlewares/likeStatusMiddleware"

const commentsController = container.get(CommentsController)
const tokenAuthMiddleware = container.get(TokenAuthMiddleware)
const errorResultMiddleware = container.get(ErrorResultMiddleware)
const optionalAccessTokenMiddleware = container.get(OptionalAccessTokenMiddleware)

export const commentsRouter = Router()

commentsRouter.get('/:id', 
  optionalAccessTokenMiddleware.optionalAccessTokenMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  commentsController.getComment.bind(commentsController))
commentsRouter.put('/:id',
  tokenAuthMiddleware.tokenAuthMiddleware,
  commentContentValidator,
  errorResultMiddleware.errorResultMiddleware,
  commentsController.changeComment.bind(commentsController))
commentsRouter.put('/:id/like-status',
  tokenAuthMiddleware.tokenAuthMiddleware,
  likeStatusValidator,
  errorResultMiddleware.errorResultMiddleware,
  commentsController.setLikeStatus.bind(commentsController))
commentsRouter.delete('/:id',
  tokenAuthMiddleware.tokenAuthMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  commentsController.deleteComment.bind(commentsController))