import { Request, Response } from 'express'
import { PostModel, PostViewModel } from "../../db/post-db"
import { postsRepository } from "./postsRepository"
import { PostInputModel } from '../../input-output-types/post-types'
import { ObjectId } from 'mongodb'
import { postsService } from './postsService'

export const postsController = {
  async getPostsController (
    req: Request,
    res: Response<PostModel[]>
  ) {
    const posts = await postsRepository.getPosts()
    res.status(200).json(posts)
  },
  async createPostController (
    req: Request<PostInputModel>,
    res: Response<PostViewModel | null>
  ) {
    const newPost = await postsService.createPost(req.body)
    if(!newPost) {
      res.sendStatus(400)
      return
    }
    res.status(201).json(newPost)
  },
  async changePostController (
    req: Request<({id: string}), any, PostInputModel>,
    res: Response
  ) {
    const updateStatus = await postsService.changeById(req.body, req.params.id)
    if(!updateStatus) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },
  async findPostController (
    req: Request<{id: string | ObjectId}>,
    res: Response<PostModel | null>
  ) {
    const { id } = req.params
    let post = null
    if (ObjectId.isValid(id)) {
      post = await postsService.findByUUID(new ObjectId(id))
    } else if (typeof(id)==='string') {
      post = await postsService.findById(id)
    }
    if (!post) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(post)
  },
  async deletePostController (
    req: Request<{ id: string }>,
    res: Response) {
    const post = await postsService.findById(req.params.id)
    if(!post) {
      res.sendStatus(404)
      return
    }
    const postForDeleting = await postsService.deleteById(req.params.id)
    if (!postForDeleting) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  }
}