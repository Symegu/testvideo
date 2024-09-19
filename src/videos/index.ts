import {Request, Response, Router} from 'express'
import {getVideosController} from './getVideosController'
import {createVideoController} from './createVideoController'
import {db} from "../db/db";
import {deleteAllData} from './deleteAllData';
import {findVideoController} from './findVideoController'
// import {deleteVideoController} from './deleteVideoController'

export const videosRouter = Router()

const videoController = {
    getVideosController: getVideosController,
    createVideoController: createVideoController,
    findVideoController: findVideoController
}

videosRouter.get('/', videoController.getVideosController)
videosRouter.post('/', videoController.createVideoController)
videosRouter.get('/:id', videoController.findVideoController)
// videosRouter.delete('/:id', deleteVideoController)
// ...
videosRouter.delete('/testing/all-data', deleteAllData)

// не забудьте добавить роут в апп