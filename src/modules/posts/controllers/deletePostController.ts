import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'

export const deletePostController = (req: Request<{id: string}>, res: Response) => {
  const post = postsRepository.findById(req.params.id)
  postsRepository.deleteById(req.params.id)
  if(!post) {
    res.sendStatus(204)
  }
  res.sendStatus(404)
}