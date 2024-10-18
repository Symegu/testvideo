import { Router } from 'express'
import { getBlogsController } from './controllers/getBlogsController'
import { createBlogController } from './controllers/createBlogController'
import { findBlogController } from './controllers/findBlogController'
import { deleteBlogController } from './controllers/deleteBlogController'
import { changeBlogController } from './controllers/changeBlogController'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'
import { findBlogMiddleware, descriptionValidator, nameValidator, websiteUrlValidator } from './middlewares/blogValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'

export const blogsRouter = Router()

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogMiddleware, findBlogController)
blogsRouter.post('/', adminAuthorizationMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, errorResultMiddleware, createBlogController)
blogsRouter.put('/:id', adminAuthorizationMiddleware, findBlogMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, errorResultMiddleware, changeBlogController)
blogsRouter.delete('/:id', adminAuthorizationMiddleware, errorResultMiddleware, findBlogMiddleware, deleteBlogController)