import { Router } from 'express'
import { getPostsController } from './controllers/getPostsController'
import { createPostController } from './controllers/createPostController'
import { findPostController } from './controllers/findPostController'
import { deletePostController } from './controllers/deletePostController'
import { changePostController } from './controllers/changePostController'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'

export const postsRouter = Router()

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', adminAuthorizationMiddleware, createPostController)
postsRouter.put('/:id', adminAuthorizationMiddleware, changePostController)
postsRouter.delete('/:id', adminAuthorizationMiddleware, deletePostController)