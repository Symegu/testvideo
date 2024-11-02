import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { PostModel } from '../../../db/post-db'
import { ObjectId } from 'mongodb'

export const findPostController = async (req: Request<{id: string | ObjectId}>, res: Response<PostModel | null>) => {
  const { id } = req.params
  let post = null
  if (ObjectId.isValid(id)) {
    post = await postsRepository.findByUUID(new ObjectId(id))
  } else if (typeof(id)==='string') {
    post = await postsRepository.findById(id)
  }
  if (!post) {
    res.sendStatus(404)
    return
  }
  res.status(200).json(post)
}