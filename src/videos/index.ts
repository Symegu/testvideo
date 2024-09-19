import {Request, Response, Router} from 'express'
import {getVideosController} from './getVideosController'
import {createVideoController} from './createVideoController'
import {db} from "../db/db";
// import {findVideoController} from './findVideoController'
// import {deleteVideoController} from './deleteVideoController'

export const videosRouter = Router()

const videoController = {
    getVideosController: (req: Request, res: Response<any /*OutputVideoType[]*/>) => {
        const videos = db.videos // получаем видео из базы данных

        res
            .status(200)
            .json(videos) // отдаём видео в качестве ответа
    },
    createVideoController: createVideoController,
}

videosRouter.get('/', videoController.getVideosController)
videosRouter.post('/', videoController.createVideoController)
// videosRouter.get('/:id', findVideoController)
// videosRouter.delete('/:id', deleteVideoController)
// ...

// не забудьте добавить роут в апп