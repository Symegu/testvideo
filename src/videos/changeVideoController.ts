import { Response, Request } from 'express'
import { OutputErrorsType } from '../input-output-types/output-errors-type'
import { db } from '../db/db'
import { InputVideoType, Resolutions, OutputVideoType, InputChangeVideoType } from '../input-output-types/video-types'
import { VideoDBType } from '../db/video-db'

const inputValidation = (video: InputChangeVideoType) => {
  const errors: OutputErrorsType = { // объект для сбора ошибок
    errorsMessages: []
  }

  if (video.title.trim().length >= 40 || !video.title || typeof video.title !== 'string') {
    console.log(video.title)
    errors.errorsMessages.push(
      { message: 'error!!!!', field: 'title' }
    )
  }

  if (video.author.trim().length >= 20 || !video.author || typeof video.author !== 'string') {
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

export const changeVideoController = (req: Request<any>, res: Response<OutputVideoType | OutputErrorsType>) => {
  const errors = inputValidation(req.body)
  if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
    res
      .status(400)
      .json(errors)
    return
    // return res.status(400).json(errors)
  }
  let video = db.videos.find(video => video.id === +req.params.id)
  console.log(video);
  if (!video) {
    res.sendStatus(404)
    return
  }
  video.title = video.title !== req.body.title ? req.body.title : video.title;
  video.author = video.author !== req.body.author ? req.body.author : video.author;
  video.canBeDownloaded = video.canBeDownloaded !== req.body.canBeDownloaded ? req.body.canBeDownloaded : video.canBeDownloaded;
  video.minAgeRestriction = video.minAgeRestriction !== req.body.minAgeRestriction ? req.body.minAgeRestriction : video.minAgeRestriction;
  video.publicationDate = video.publicationDate !== req.body.publicationDate ? req.body.publicationDate : video.publicationDate;
  video.availableResolutions = video.availableResolutions !== req.body.availableResolutions ? req.body.availableResolutions : video.availableResolutions;

  db.videos = db.videos.map(changedvideo => changedvideo.id === video!.id ? video : changedvideo);
res
    .sendStatus(204)
}
