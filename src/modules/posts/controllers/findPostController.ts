import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostModel } from '../../../db/post-db'

export const findPostController = async (req: Request<{id: string}>, res: Response<PostModel>) => {
  const post = await postsRepository.findById(req.params.id)
  if(!post) {
    res.sendStatus(404)
    return
  }
  res.status(200).json(post)
}