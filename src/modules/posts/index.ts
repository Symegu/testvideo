import { Router } from 'express'
import { AdminAuthorizationMiddleware } from '../../globalMiddlewares/adminAuthorizationMiddleware'
import { contentValidator, blogIdValidator, shortDescriptionValidator, titleValidator } from './middlewares/postValidators'
import { ErrorResultMiddleware } from '../../globalMiddlewares/errorResultMiddleware'
import { PostsController } from './postsController'
import { TokenAuthMiddleware } from '../auth/middlewares/tokenAuthMiddleware'
import { commentContentValidator } from '../comments/middlewares/commentsValidators'
import { container } from '../other/composition-root'
import { OptionalAccessTokenMiddleware } from '../auth/middlewares/optionalAccessTokenMiddleware'
import { likeStatusValidator } from '../likes/middlewares/likeStatusMiddleware'


const tokenAuthMiddleware = container.get(TokenAuthMiddleware)
const optionalAccessTokenMiddleware = container.get(OptionalAccessTokenMiddleware)
const adminAuthorizationMiddleware = container.get(AdminAuthorizationMiddleware)
const errorResultMiddleware = container.get(ErrorResultMiddleware)
const postsController = container.get(PostsController)

export const postsRouter = Router()

postsRouter.get('/', 
  optionalAccessTokenMiddleware.optionalAccessTokenMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  postsController.getPostsController.bind(postsController))
postsRouter.get('/:id', 
  optionalAccessTokenMiddleware.optionalAccessTokenMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  postsController.findPostController.bind(postsController))
postsRouter.post('/',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  titleValidator,
  blogIdValidator,
  shortDescriptionValidator,
  contentValidator,
  errorResultMiddleware.errorResultMiddleware,
  postsController.createPostController.bind(postsController))
postsRouter.put('/:id',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  titleValidator,
  blogIdValidator,
  shortDescriptionValidator,
  contentValidator,
  errorResultMiddleware.errorResultMiddleware,
  postsController.changePostController.bind(postsController))
postsRouter.delete('/:id',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  postsController.deletePostController.bind(postsController))

postsRouter.get('/:id/comments',
  optionalAccessTokenMiddleware.optionalAccessTokenMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  postsController.getCommentsController.bind(postsController))
postsRouter.post('/:id/comments',
  tokenAuthMiddleware.tokenAuthMiddleware,
  commentContentValidator,
  errorResultMiddleware.errorResultMiddleware,
  postsController.createComment.bind(postsController))

postsRouter.put('/:postId/like-status', 
  tokenAuthMiddleware.tokenAuthMiddleware,
  likeStatusValidator,
  errorResultMiddleware.errorResultMiddleware,
  postsController.likePostController.bind(postsController))