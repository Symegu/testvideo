import { Request, Response } from 'express'
import { videosDBRepository } from '../videosDbRepository'
import { VideoDBType } from '../../../db/video-db'

export const  getVideosController = async(req: Request, res: Response<VideoDBType[]>) => {
    const videos = await videosDBRepository.getAll() // получаем видео из базы данных

    res
        .status(200)
        .json(videos) // отдаём видео в качестве ответа
}

// не забудьте добавить эндпоинт в апп