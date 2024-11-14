import { Router } from 'express'
import { adminAuthorizationMiddleware } from '../../global-middlewares/adminAuthorizationMiddleware'
import { descriptionValidator, nameValidator, websiteUrlValidator } from './middlewares/blogValidators'
import { errorResultMiddleware } from '../../global-middlewares/errorResultMiddleware'
import { blogsController } from './blogsController'
import { titleValidator, blogIdValidator, shortDescriptionValidator, contentValidator } from '../posts/middlewares/postValidators'

export const blogsRouter = Router()

blogsRouter.get('/', blogsController.getBlogsController)
blogsRouter.get('/:id', blogsController.findBlogController)
blogsRouter.get('/:id/posts', blogsController.getBlogPostsController)
blogsRouter.post('/', 
  adminAuthorizationMiddleware,
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  errorResultMiddleware,
  blogsController.createBlogController)
blogsRouter.post('/:id/posts', 
  adminAuthorizationMiddleware, 
  titleValidator,
  blogIdValidator,
  shortDescriptionValidator,
  contentValidator,
  errorResultMiddleware,
  blogsController.createBlogsPostController)
blogsRouter.put('/:id', 
  adminAuthorizationMiddleware,
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  errorResultMiddleware,
  blogsController.changeBlogController)
blogsRouter.delete('/:id',
  adminAuthorizationMiddleware,
  errorResultMiddleware,
  blogsController.deleteBlogController)

