import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostInputType } from '../../../input-output-types/post-types'
import { PostModel } from '../../../db/post-db'

export const createPostController = async (req: Request<PostInputType>, res: Response<PostModel | null>) => {
  const newPostId = await postsRepository.createPost(req.body)
  if(!newPostId) {
    res.sendStatus(400)
    return
  }
  const newPost = await postsRepository.findByUUID(newPostId)
  if(!newPost) {
    res.sendStatus(404)
    return
  }
  res.status(201).json(newPost)
}