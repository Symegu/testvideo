import { Router } from 'express'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'
import { contentValidator, blogIdValidator, shortDescriptionValidator, titleValidator } from './middlewares/postValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'
import { postsController } from './postsController';

export const postsRouter = Router()

postsRouter.get('/', postsController.getPostsController)
postsRouter.get('/:id', postsController.findPostController)
postsRouter.post('/', adminAuthorizationMiddleware, titleValidator, blogIdValidator, shortDescriptionValidator, contentValidator, errorResultMiddleware, postsController.createPostController)
postsRouter.put('/:id', adminAuthorizationMiddleware, titleValidator, blogIdValidator, shortDescriptionValidator, contentValidator, errorResultMiddleware, postsController.changePostController)
postsRouter.delete('/:id', adminAuthorizationMiddleware, errorResultMiddleware, postsController.deletePostController)