import {Response, Request} from 'express'
import {OutputErrorsType} from '../input-output-types/output-errors-type'
import {db} from '../db/db'
import {InputVideoType, Resolutions, OutputVideoType, ResolutionsString} from '../input-output-types/video-types'

const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }
    let {title, author, availableResolution} = video
    if (title.trim().length > 40 || !title || typeof(title) !== 'string') {
        console.log(title)
        errors.errorsMessages.push(
            {message: 'error!!!!', field: 'title'}
        )
    }

    if (author.trim().length > 20 || !author || typeof(author) !== 'string') {
        console.log(title)
        errors.errorsMessages.push(
            {message: 'error!!!!', field: 'author'}
        )
    }

    if (!Array.isArray(availableResolution)
        || availableResolution.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolution'
        })
    }
    return errors
}

export const createVideoController = (req: Request<any, any, InputVideoType>, res: Response<OutputVideoType | OutputErrorsType>) => {
    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)
        return
        // return res.status(400).json(errors)
    }
    const createdAt = new Date();
    const publicationDate = new Date(createdAt);
    const newVideo: any /*VideoDBType*/ = {
        ...req.body,
        id: Date.now() + Math.random(),
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString,
        publicationDate: publicationDate.toISOString
    }
    db.videos.push(newVideo)

    res
        .status(201)
        .json(newVideo)
}
