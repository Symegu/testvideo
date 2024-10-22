import { Response, Request } from 'express'
import { OutputErrorsType } from '../../../input-output-types/output-errors-type'
import { Resolutions, OutputVideoType, InputChangeVideoType, VideoIdType } from '../../../input-output-types/video-types'
import { videosDBRepository } from '../videosDbRepository'

const inputValidation = (video: InputChangeVideoType) => {
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

  if (!Array.isArray(video.availableResolutions) || video.availableResolutions.find(p => !Resolutions[p])
  ) {
    errors.errorsMessages.push({
      message: 'error!!!!', field: 'availableResolutions'
    })
  }

  if (typeof video.canBeDownloaded !== 'boolean') {
    errors.errorsMessages.push(
      { message: 'error!!!!', field: 'canBeDownloaded' }
    )
  }

  if (typeof video.minAgeRestriction !== 'number' || video.minAgeRestriction > 18 || video.minAgeRestriction < 1) {
    errors.errorsMessages.push(
      { message: 'error!!!!', field: 'minAgeRestriction' }
    )
  }

  if (!video.publicationDate || typeof video.publicationDate !== 'string') {
    errors.errorsMessages.push(
      { message: 'error!!!!', field: 'publicationDate' }
    )
  }


  return errors
}

export const changeVideoController = async (req: Request<{ id: number }, any, InputChangeVideoType>, res: Response<OutputVideoType | OutputErrorsType>) => {
  const errors = inputValidation(req.body)
  if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
    res
      .status(400)
      .json(errors)
    return
    // return res.status(400).json(errors)
  }
  await videosDBRepository.change(req.params.id, req.body)
  res
    .sendStatus(204)
}
