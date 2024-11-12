import { Router } from 'express'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'
import { descriptionValidator, nameValidator, websiteUrlValidator } from './middlewares/blogValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'
import { blogsController } from './blogsController'

export const blogsRouter = Router()

blogsRouter.get('/', blogsController.getBlogsController)
blogsRouter.get('/:id', blogsController.findBlogController)
blogsRouter.post('/', adminAuthorizationMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, errorResultMiddleware, blogsController.createBlogController)
blogsRouter.put('/:id', adminAuthorizationMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, errorResultMiddleware, blogsController.changeBlogController)
blogsRouter.delete('/:id', adminAuthorizationMiddleware, errorResultMiddleware, blogsController.deleteBlogController)