import { Request, Response } from 'express'
import { PostViewModel } from "../../types/db-types/post-db"
import { PostInputModel } from '../../types/input-output-types/post-types'
import { PostsService } from './postsService'
import { PaginatorCommentsModel, PaginatorPostModel } from '../../types/paginator-types'
import { PaginationQueries } from '../other/paginationQueries'
import { PostsQueryRepository } from './postsQueryRepository'
import { CommentInputModel } from '../../types/input-output-types/comment-types'
import { CommentViewModel } from '../../types/db-types/comment-db'
import { CommentsQueryRepository } from '../comments/commentsQueryRepository'
import { CommentsService } from '../comments/commentsService'
import { HttpStatuses } from '../../types/input-output-types/output-errors-type'
import { injectable } from 'inversify'

@injectable()
export class PostsController {

  constructor(
    protected postsService: PostsService,
    protected paginationQueries: PaginationQueries,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentsService: CommentsService,
  ){}

  async getPostsController(
    req: Request,
    res: Response<PaginatorPostModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = this.paginationQueries.getPaginationParams()
    const posts = await this.postsQueryRepository.getAllPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.blogId)
    console.log('all posts', req.params, searchNameTerm)
    res.status(HttpStatuses.Success).json(posts)
    return
  }

  async createPostController(
    req: Request<PostInputModel>,
    res: Response<PostViewModel | null>
  ) {
    const newPost = await this.postsService.createPost(req.body)
    if (!newPost) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    res.status(HttpStatuses.Created).json(newPost)
  }

  async changePostController(
    req: Request<({ id: string }), any, PostInputModel>,
    res: Response
  ) {
    const updateStatus = await this.postsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }

  async findPostController(
    req: Request<{ id: string }>,
    res: Response<PostViewModel | null>
  ) {
    const post = await this.postsQueryRepository.findById(req.params.id)
    console.log(post)
    if (!post) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.status(HttpStatuses.Success).json(post)
    return
  }

  async deletePostController(
    req: Request<{ id: string }>,
    res: Response) {
    const post = await this.postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    const postForDeleting = await this.postsService.deleteById(req.params.id)
    if (!postForDeleting) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }

  async createComment(req: Request<{ id: string }, any, CommentInputModel>, res: Response<CommentViewModel>) {
    const post = await this.postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    const newCommentId = await this.commentsService.createComment(req.body, req.userId!, req.userLogin!, req.params.id)
    if (!newCommentId) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }

    const newComment = await this.commentsQueryRepository.findById(newCommentId)
    if (!newComment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.status(HttpStatuses.Created).json(newComment)
  }

  async getCommentsController(
    req: Request<{ id: string }>,
    res: Response<PaginatorCommentsModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = this.paginationQueries.getPaginationParams()
    const post = await this.postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    const comments = await this.commentsQueryRepository.getCommentsOfPost(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.id)
    console.log('all comments for post', req.params, searchNameTerm)
    res.status(HttpStatuses.Success).json(comments)
    return
  }
}