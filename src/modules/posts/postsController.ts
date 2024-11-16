import { Request, Response } from 'express'
import { PostViewModel } from "../../db/post-db"
import { PostInputModel } from '../../input-output-types/post-types'
import { postsService } from './postsService'
import { PaginatorPostModel } from '../other/paginator-types'
import { paginationQueries } from '../other/paginationQueries'

export const postsController = {
  async getPostsController (
    req: Request,
    res: Response<PaginatorPostModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const posts = await postsService.getPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    console.log('all posts', req.params, searchNameTerm)
    res.status(200).json(posts)
    return
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
    req: Request<{id: string}>,
    res: Response<PostViewModel | null>
  ) {
    const post = await postsService.findById(req.params.id)
    console.log(post)
    if (!post) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(post)
    return
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