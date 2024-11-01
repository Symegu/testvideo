import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostInputType } from '../../../input-output-types/post-types'
import { PostModel } from '../../../db/post-db'

export const createPostController = async (req: Request<PostInputType>, res: Response<PostModel>) => {
  const newPostId = await postsRepository.createPost(req.body)
  const newPost = await postsRepository.findByUUID(newPostId)
  if(!newPost) {
    res.sendStatus(404)
  }
  res.status(201).json(newPost!)
}