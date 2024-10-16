import {Router} from 'express'
import {getBlogsController} from './controllers/getBlogsController.ts'
import {createBlogController} from './controllers/createBlogController'
import {findBlogController} from './controllers/findBlogController'
import {deleteBlogController} from './controllers/deleteBlogController'
import {changeBlogController} from './controllers/changeBlogController'

export const blogsRouter = Router()

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.post('/', createBlogController)
blogsRouter.put('/:id', changeBlogController)
blogsRouter.delete('/:id', deleteBlogController)