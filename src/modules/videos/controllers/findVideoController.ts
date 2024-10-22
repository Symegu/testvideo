import { Request, Response } from 'express'
// import { OutputErrorsType } from '../../../input-output-types/output-errors-type'
import { videosDBRepository } from '../videosDbRepository'
import { VideoDBType } from '../../../db/video-db'

export const findVideoController = async (req: Request<{ id: number }>, res: Response<VideoDBType>) => {
  const video = await videosDBRepository.findId(req.params.id)
  console.log(video);
  if (!video) {
    res.sendStatus(404)
  }

  res.status(200).json(video)
}