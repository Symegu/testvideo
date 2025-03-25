import { Router } from 'express'
import { AdminAuthorizationMiddleware } from '../../globalMiddlewares/adminAuthorizationMiddleware'
import { descriptionValidator, nameValidator, websiteUrlValidator } from './middlewares/blogValidators'
import { ErrorResultMiddleware } from '../../globalMiddlewares/errorResultMiddleware'
import { BlogsController } from './blogsController'
import { titleValidator, shortDescriptionValidator, contentValidator } from '../posts/middlewares/postValidators'
import { container } from '../other/composition-root'

const blogsController = container.get(BlogsController)
const adminAuthorizationMiddleware = container.get(AdminAuthorizationMiddleware)
const errorResultMiddleware = container.get(ErrorResultMiddleware)

export const blogsRouter = Router()

blogsRouter.get('/', blogsController.getBlogsController)
blogsRouter.get('/:id', blogsController.findBlogController)
blogsRouter.get('/:id/posts', blogsController.getBlogPostsController)
blogsRouter.post('/', 
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  errorResultMiddleware.errorResultMiddleware,
  blogsController.createBlogController.bind(blogsController))
blogsRouter.post('/:id/posts', 
  adminAuthorizationMiddleware.adminAuthorizationMiddleware, 
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  errorResultMiddleware.errorResultMiddleware,
  blogsController.createBlogsPostController.bind(blogsController))
blogsRouter.put('/:id', 
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  errorResultMiddleware.errorResultMiddleware,
  blogsController.changeBlogController.bind(blogsController))
blogsRouter.delete('/:id',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  blogsController.deleteBlogController.bind(blogsController))

