import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'

export const deletePostController = async (req: Request<{ id: string }>, res: Response) => {
  const post = await postsRepository.findById(req.params.id)
  if(!post) {
    res.sendStatus(404)
    return
  }
  const postForDeleting = await postsRepository.deleteById(req.params.id)
  if (!postForDeleting) {
    res.sendStatus(404)
    return
  }
  res.sendStatus(204)
}