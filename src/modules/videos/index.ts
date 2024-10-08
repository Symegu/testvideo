import {Request, Response, Router} from 'express'
import {getVideosController} from './getVideosController'
import {createVideoController} from './createVideoController'
import {db} from "../../db/db"
import {findVideoController} from './findVideoController'
import {deleteVideoController} from './deleteVideoController'
import {changeVideoController} from './changeVideoController'

export const videosRouter = Router()

// const videoController = {
//     getVideosController: getVideosController,
//     createVideoController: createVideoController,
//     findVideoController: findVideoController,
//     deleteVideoController: deleteVideoController
// }

videosRouter.get('/', getVideosController)
videosRouter.post('/', createVideoController)
videosRouter.get('/:id', findVideoController)
videosRouter.delete('/:id', deleteVideoController)
videosRouter.put('/:id', changeVideoController) 
// не забудьте добавить роут в апп