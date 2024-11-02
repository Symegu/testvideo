import { Router } from 'express'
import { getPostsController } from './controllers/getPostsController'
import { createPostController } from './controllers/createPostController'
import { findPostController } from './controllers/findPostController'
import { deletePostController } from './controllers/deletePostController'
import { changePostController } from './controllers/changePostController'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'
import { contentValidator, postIdValidator, shortDescriptionValidator, titleValidator } from './middlewares/postValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'

export const postsRouter = Router()

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', adminAuthorizationMiddleware, titleValidator, shortDescriptionValidator, contentValidator, postIdValidator, errorResultMiddleware, createPostController)
postsRouter.put('/:id', adminAuthorizationMiddleware, titleValidator, shortDescriptionValidator, contentValidator, postIdValidator, errorResultMiddleware, changePostController)
postsRouter.delete('/:id', adminAuthorizationMiddleware, errorResultMiddleware, deletePostController)