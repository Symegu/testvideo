import { Router } from 'express'
import { getVideosController } from './controllers/getVideosController'
import { createVideoController } from './controllers/createVideoController'
import { findVideoController } from './controllers/findVideoController'
import { deleteVideoController } from './controllers/deleteVideoController'
import { changeVideoController } from './controllers/changeVideoController'

export const videosRouter = Router()

videosRouter.get('/', getVideosController)
videosRouter.post('/', createVideoController)
videosRouter.get('/:id', findVideoController)
videosRouter.delete('/:id', deleteVideoController)
videosRouter.put('/:id', changeVideoController)
// не забудьте добавить роут в апп