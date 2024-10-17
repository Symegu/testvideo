import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'

export const deletePostController = (req: Request<{id: string}>, res: Response) => {
  const post = postsRepository.findById(req.body.id)
  postsRepository.deleteById(req.body.id)
  if(!post) {
    res.sendStatus(204)
  }
  res.sendStatus(404)
}