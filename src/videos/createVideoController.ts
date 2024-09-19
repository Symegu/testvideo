import {Response, Request} from 'express'
import {OutputErrorsType} from '../input-output-types/output-errors-type'
import {db} from '../db/db'
import {InputVideoType, Resolutions, OutputVideoType} from '../input-output-types/video-types'
import {VideoDBType} from '../db/video-db'

const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }
    let {title, author, availableResolutions} = video
    if (title.trim().length >= 40 || !title || typeof(title) !== 'string') {
        console.log(title)
        errors.errorsMessages.push(
            {message: 'error!!!!', field: 'title'}
        )
    }

    if (author.trim().length >= 20 || !author || typeof(author) !== 'string') {
        console.log(title)
        errors.errorsMessages.push(
            {message: 'error!!!!', field: 'author'}
        )
    }

    if (!Array.isArray(availableResolutions)
        || availableResolutions.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolutions'
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

    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const publicationDate = (new Date(dateNow))
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()

    const newVideo:VideoDBType = {
        ...req.body,
        id: dateNow + Math.random(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAtISO,
        publicationDate: publicationDateISO,
    }
    db.videos = [...db.videos, newVideo]

    res
        .status(201)
        .json(newVideo)
}
