import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostDBType } from '../../../db/post-db'

export const getPostsController = (req: Request, res: Response<PostDBType[]>) => {
  const posts = postsRepository.getPosts()
  res.status(200).json(posts)
}