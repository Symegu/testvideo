import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostModel } from '../../../db/post-db'

export const getPostsController = async (req: Request, res: Response<PostModel[]>) => {
  const posts = await postsRepository.getPosts()
  res.status(200).json(posts)
}