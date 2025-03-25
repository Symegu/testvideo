import { Request, Response } from 'express'
import { PaginationQueries } from "../other/paginationQueries"
import { BlogsService } from "./blogsService"
import { BlogViewModel } from '../../types/db-types/blog-db'
import { BlogsRepository } from './blogsRepository'
import { BlogInputModel } from '../../types/input-output-types/blog-types'
import { PostInputModel } from '../../types/input-output-types/post-types'
import { PostViewModel } from '../../types/db-types/post-db'
import { PaginatorBlogModel } from '../../types/paginator-types'
import { BlogsQueryRepository } from './blogsQueryRepository'
import { PostsQueryRepository } from '../posts/postsQueryRepository'
import { HttpStatuses } from '../../types/input-output-types/output-errors-type'
import { injectable } from 'inversify'

@injectable()
export class BlogsController {

  constructor(
    protected paginationQueries: PaginationQueries,
    protected blogsService: BlogsService,
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ){}

  async getBlogsController(
    req: Request,
    res: Response<PaginatorBlogModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = this.paginationQueries.getPaginationParams()
    const blogs = await this.blogsQueryRepository.getAllBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    res.status(HttpStatuses.Success).json(blogs)
    return
  }

  async getBlogPostsController(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = this.paginationQueries.getPaginationParams()
    const blog = await this.blogsQueryRepository.findById(req.params.id)
    if (!blog) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    const posts = await this.postsQueryRepository.getAllPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.id)
    if (!posts) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.status(HttpStatuses.Success).json(posts)
  }

  async createBlogController(
    req: Request<BlogInputModel>,
    res: Response<BlogViewModel | null>
  ) {
    const createdBlog = await this.blogsService.createBlog(req.body)
    if (!createdBlog) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    res.status(HttpStatuses.Created).json(createdBlog.data)
  }

  async changeBlogController(
    req: Request<{ id: string }, any, BlogInputModel>,
    res: Response<boolean>
  ) {
    const updateStatus = await this.blogsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }

  async findBlogController(
    req: Request<{ id: string }>,
    res: Response<BlogViewModel>
  ) {
    const blog = await this.blogsQueryRepository.findById(req.params.id)

    console.log(blog)
    if (!blog) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.status(HttpStatuses.Success).json(blog)
    return
  }

  async deleteBlogController(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const blog = await this.blogsRepository.deleteById(req.params.id)
    if (blog.status !== 'Success') {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }

  async createBlogsPostController(
    req: Request<{ id: string }, PostInputModel>,
    res: Response<PostViewModel | null>
  ) {
    const currentBlog = await this.blogsQueryRepository.findById(req.params.id)
    if (!currentBlog) {
      console.log('createBlogsPostController currentBlog', currentBlog);
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    const createdPost = await this.blogsService.createBlogsPost(req.body, currentBlog)
    if (!createdPost) {
      res.sendStatus(HttpStatuses.BadRequest)
      return
    }
    res.status(HttpStatuses.Created).json(createdPost)
  }
}