import { Request, Response } from 'express'
import { PostViewModel } from "../../types/db-types/post-db"
import { PostInputModel } from '../../types/input-output-types/post-types'
import { PostsService } from './postsService'
import { PaginatorCommentsModel, PaginatorPostModel } from '../../types/paginator-types'
import { PaginationQueries } from '../other/paginationQueries'
import { PostsQueryRepository } from './postsQueryRepository'
import { CommentInputModel } from '../../types/input-output-types/comment-types'
import { CommentViewModel, LikeStatus } from '../../types/db-types/comment-db'
import { CommentsQueryRepository } from '../comments/commentsQueryRepository'
import { CommentsService } from '../comments/commentsService'
import { HttpStatuses, ResultStatus } from '../../types/input-output-types/output-errors-type'
import { inject, injectable } from 'inversify'
import { JwtService } from '../other/jwtService'
import { LikesService } from '../likes/likesService'

@injectable()
export class PostsController {

  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(LikesService) protected likesService: LikesService,
  ) { }

  async getPostsController(
    req: Request,
    res: Response<PaginatorPostModel>
  ) {
    const paginationQueries = new PaginationQueries(req)
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries.getPaginationParams()
    const userId = req.userId ?? null
    const posts = await this.postsQueryRepository.getAllPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.blogId, userId)
    if (userId) {
      await Promise.all(
        posts.items.map(async (post) => {
          const like = await this.likesService.calculateMyStatus(post.id, userId)
          post.extendedLikesInfo.myStatus = like?.data || LikeStatus.None
          console.log('getPostsController posts post --->', post);

        })
      )
    }

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
    const userId = req.userId ?? null
    if (userId) {
      const like = await this.likesService.calculateMyStatus(post.id, userId)
      post.extendedLikesInfo.myStatus = like?.data || LikeStatus.None
      console.log('findPostController posts post --->', post);
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
    if (!req.userId || !req.userLogin) {
      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    console.log('createComment PostsController req.userId req.userLogin', req.userId, req.userLogin);

    const post = await this.postsQueryRepository.findById(req.params.id)
    if (!post) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    console.log('createComment PostsController post', post);

    const newCommentId = await this.commentsService.createComment(req.body, req.userId!, req.userLogin!, req.params.id)
    if (!newCommentId) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    console.log('createComment PostsController newCommentId', newCommentId);
    const newComment = await this.commentsQueryRepository.findById(newCommentId)
    if (!newComment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    console.log('createComment PostsController newComment', newComment);
    res.status(HttpStatuses.Created).json(newComment)
  }

  async getCommentsController(
    req: Request<{ id: string }>,
    res: Response<PaginatorCommentsModel>
  ) {
    const postId = req.params.id
    const userId = req.userId ?? null

    const paginationQueries = new PaginationQueries(req)
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries.getPaginationParams()

    const post = await this.postsQueryRepository.findById(postId)
    if (!post) {
      res.sendStatus(404)
      return
    }

    const commentsPaginator = await this.commentsQueryRepository.getCommentsOfPost(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
      postId,
      userId
    )

    if (userId) {
      await Promise.all(
        commentsPaginator.items.map(async (comment) => {
          const like = await this.likesService.calculateMyStatus(comment.id, userId)
          comment.likesInfo.myStatus = like?.data || LikeStatus.None
          console.log('getCommentsController commentsPaginator comment --->', comment);

        })
      )
    }

    res.status(200).json(commentsPaginator)
    return
  }

  async likePostController(req: Request<{ postId: string }, any, { likeStatus: LikeStatus }>, res: Response) {
    if (!req.userId || !req.userLogin) {
      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }
    const result = await this.postsService.setLikeStatus(req.body.likeStatus, req.params.postId, req.userId!, req.userLogin!)
    if (result.status === ResultStatus.NotFound) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    if (result.status === ResultStatus.Forbidden) {
      res.sendStatus(HttpStatuses.Forbidden)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }
}