import { Router } from 'express'
import { getBlogsController } from './controllers/getBlogsController'
import { createBlogController } from './controllers/createBlogController'
import { findBlogController } from './controllers/findBlogController'
import { deleteBlogController } from './controllers/deleteBlogController'
import { changeBlogController } from './controllers/changeBlogController'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'

export const blogsRouter = Router()

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.post('/', adminAuthorizationMiddleware, createBlogController)
blogsRouter.put('/:id', adminAuthorizationMiddleware, changeBlogController)
blogsRouter.delete('/:id', adminAuthorizationMiddleware, deleteBlogController)