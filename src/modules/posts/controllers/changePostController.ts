import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostInputType } from '../../../input-output-types/post-types'

export const changePostController = (req: Request<({id: string}), any, PostInputType>, res: Response) => {
  const currentPost = postsRepository.findById(req.params.id)
  postsRepository.changeById(req.body, currentPost!.id )
  res.sendStatus(204)
}