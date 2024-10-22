import { Request, Response } from 'express'
import { videosDBRepository } from '../videosDbRepository'

export const deleteVideoController = async (req: Request<{ id: number }>, res: Response) => {
  const video = await videosDBRepository.findId(req.params.id)
  console.log(video);
  if (!video) {
    res.sendStatus(404)
    return
  }
  await videosDBRepository.delete(video!.id)
  res.sendStatus(204)
}