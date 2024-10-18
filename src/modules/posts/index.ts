import { Router } from 'express'
import { getPostsController } from './controllers/getPostsController'
import { createPostController } from './controllers/createPostController'
import { findPostController } from './controllers/findPostController'
import { deletePostController } from './controllers/deletePostController'
import { changePostController } from './controllers/changePostController'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'
import { contentValidator, findPostMiddleware, postIdValidator, shortDescriptionValidator, titleValidator } from './middlewares/postValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'

export const postsRouter = Router()

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostMiddleware, errorResultMiddleware, findPostController)
postsRouter.post('/', adminAuthorizationMiddleware, titleValidator, shortDescriptionValidator, contentValidator, postIdValidator, errorResultMiddleware, createPostController)
postsRouter.put('/:id', adminAuthorizationMiddleware, findPostMiddleware, titleValidator, shortDescriptionValidator, contentValidator, postIdValidator, errorResultMiddleware, changePostController)
postsRouter.delete('/:id', adminAuthorizationMiddleware, findPostMiddleware, errorResultMiddleware, deletePostController)