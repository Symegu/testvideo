import { Router } from 'express'
import { adminAuthorizationMiddleware } from '../../globalMiddlewares/adminAuthorizationMiddleware'
import { contentValidator, blogIdValidator, shortDescriptionValidator, titleValidator } from './middlewares/postValidators'
import { errorResultMiddleware } from '../../globalMiddlewares/errorResultMiddleware'
import { postsController } from './postsController';
import { tokenAuthMiddleware } from '../auth/middlewares/tokenAuthMiddleware';
import { commentContentValidator } from '../comments/middlewares/commentsValidators';

export const postsRouter = Router()

postsRouter.get('/', postsController.getPostsController)
postsRouter.get('/:id', postsController.findPostController)
postsRouter.post('/', adminAuthorizationMiddleware, titleValidator, blogIdValidator, shortDescriptionValidator, contentValidator, errorResultMiddleware, postsController.createPostController)
postsRouter.put('/:id', adminAuthorizationMiddleware, titleValidator, blogIdValidator, shortDescriptionValidator, contentValidator, errorResultMiddleware, postsController.changePostController)
postsRouter.delete('/:id', adminAuthorizationMiddleware, errorResultMiddleware, postsController.deletePostController)

postsRouter.get('/:id/comments', errorResultMiddleware, postsController.getCommentsController)
postsRouter.post('/:id/comments', tokenAuthMiddleware, commentContentValidator, errorResultMiddleware, postsController.createComment)