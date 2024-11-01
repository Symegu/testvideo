import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'

export const deletePostController = async (req: Request<{ id: string }>, res: Response) => {
  const post = await postsRepository.findById(req.params.id)
  if(!post) {
    res.sendStatus(404)
  }

  res.sendStatus(204)
}