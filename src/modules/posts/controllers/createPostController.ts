import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostInputType } from '../../../input-output-types/post-types'
import { PostDBType } from '../../../db/post-db'

export const createPostController = (req: Request<PostInputType>, res: Response<PostDBType>) => {
  const newPostId = postsRepository.createPost(req.body)
  const newPost = postsRepository.findById(newPostId)
  res.status(201).json(newPost)
}