import {Request, Response} from 'express'
import {db} from '../db/db'
import { OutputVideoType } from '../input-output-types/video-types'
import { OutputErrorsType } from '../input-output-types/output-errors-type'

export const deleteVideoController = (req: Request, res: Response<OutputVideoType | OutputErrorsType>) => {
  const {id} = req.params
  const video = db.videos.find(video => video.id !== +id)
  console.log(video);
  if (!video) {
    res.sendStatus(404)
    return
  }
  db.videos = db.videos.filter((e) => e.id !== video.id)
  res.sendStatus(204)
}