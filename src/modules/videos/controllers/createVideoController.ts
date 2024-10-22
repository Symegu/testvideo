import { Response, Request } from 'express'
import { OutputErrorsType } from '../../../input-output-types/output-errors-type'
import { InputVideoType, Resolutions } from '../../../input-output-types/video-types'
import { VideoDBType } from '../../../db/video-db'
import { videosDBRepository } from '../videosDbRepository'

const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }

    if (typeof video.title !== 'string'
        || !video.title
        || video.title.length >= 40
    ) {
        console.log(video.title)
        errors.errorsMessages.push(
            { message: 'error!!!!', field: 'title' }
        )
    }

    if (typeof video.author !== 'string'
        || !video.author
        || video.author.length >= 20) {
        console.log(video.author)
        errors.errorsMessages.push(
            { message: 'error!!!!', field: 'author' }
        )
    }

    if (!Array.isArray(video.availableResolutions)
        || video.availableResolutions.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolutions'
        })
    }
    return errors
}

export const createVideoController = async (req: Request<InputVideoType>, res: Response<VideoDBType | OutputErrorsType>) => {
    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)
        return
        // return res.status(400).json(errors)
    }

    const newVideo = await videosDBRepository.create(req.body)

    res
        .status(201)
        .json(newVideo)
}
