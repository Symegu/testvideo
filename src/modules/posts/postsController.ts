import { Request, Response } from 'express'
import { PostViewModel } from "../../types/db-types/post-db"
import { PostInputModel } from '../../types/input-output-types/post-types'
import { postsService } from './postsService'
import { PaginatorCommentsModel, PaginatorPostModel } from '../../types/paginator-types'
import { paginationQueries } from '../other/paginationQueries'
import { postsQueryRepository } from './postsQueryRepository'
import { CommentInputModel } from '../../types/input-output-types/comment-types'
import { CommentViewModel } from '../../types/db-types/comment-db'
import { commentsQueryRepository } from '../comments/commentsQueryRepository'
import { commentsService } from '../comments/commentsService'

export const postsController = {
  async getPostsController(
    req: Request,
    res: Response<PaginatorPostModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const posts = await postsQueryRepository.getAllPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.blogId)
    console.log('all posts', req.params, searchNameTerm)
    res.status(200).json(posts)
    return
  },

  async createPostController(
    req: Request<PostInputModel>,
    res: Response<PostViewModel | null>
  ) {
    const newPost = await postsService.createPost(req.body)
    if (!newPost) {
      res.sendStatus(400)
      return
    }
    res.status(201).json(newPost)
  },

  async changePostController(
    req: Request<({ id: string }), any, PostInputModel>,
    res: Response
  ) {
    const updateStatus = await postsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },

  async findPostController(
    req: Request<{ id: string }>,
    res: Response<PostViewModel | null>
  ) {
    const post = await postsQueryRepository.findById(req.params.id)
    console.log(post)
    if (!post) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(post)
    return
  },

  async deletePostController(
    req: Request<{ id: string }>,
    res: Response) {
    const post = await postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(404)
      return
    }
    const postForDeleting = await postsService.deleteById(req.params.id)
    if (!postForDeleting) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },

  async createComment(req: Request<{ id: string }, any, CommentInputModel>, res: Response<CommentViewModel>) {
    const post = await postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(404)
      return
    }
    const newCommentId = await commentsService.createComment(req.body, req.userId!, req.userLogin!, req.params.id)
    if (!newCommentId) {
      res.sendStatus(400)
      return
    }

    const newComment = await commentsQueryRepository.findById(newCommentId)
    if (!newComment) {
      res.sendStatus(404)
      return
    }

    res.status(201).json(newComment)
  },

  async getCommentsController(
    req: Request<{ id: string }>,
    res: Response<PaginatorCommentsModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const post = await postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(404)
      return
    }
    const comments = await commentsQueryRepository.getCommentsOfPost(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.id)
    console.log('all comments for post', req.params, searchNameTerm)
    res.status(200).json(comments)
    return
  },
}