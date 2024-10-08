import {Request, Response} from 'express'
import {db} from '../../db/db'
import {VideoIdType} from '../../input-output-types/video-types'

export const deleteVideoController = (req: Request<VideoIdType>, res: Response) => {
  const video = db.videos.find(video => video.id === +req.params.id)
  console.log(video);
  if (!video) {
    res.sendStatus(404)
    return
  }
  db.videos = db.videos.filter((e) => e.id !== video.id)
  res.sendStatus(204)
}