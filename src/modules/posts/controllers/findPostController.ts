import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostDBType } from '../../../db/post-db'

export const findPostController = (req: Request<{id: string}>, res: Response<PostDBType>) => {
  const post = postsRepository.findById(req.body.id)
  if(!post) {
    res.sendStatus(404)
  }
  res.status(200).json(post)
}