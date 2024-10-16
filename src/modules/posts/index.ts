import {Router} from 'express'
import {getPostsController} from './controllers/getPostsController'
import {createPostController} from './controllers/createPostController'
import {findPostController} from './controllers/findPostController'
import {deletePostController} from './controllers/deletePostController'
import {changePostController} from './controllers/changePostController'

export const postsRouter = Router()

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', createPostController)
postsRouter.put('/:id', changePostController)
postsRouter.delete('/:id', deletePostController)