import { Request, Response } from 'express'
import { PaginationQueries } from "../other/paginationQueries"
import { BlogsService } from "./blogsService"
import { BlogViewModel } from '../../types/db-types/blog-db'
import { BlogsQueryRepository } from './blogsQueryRepository'
import { BlogInputModel } from '../../types/input-output-types/blog-types'
import { PostInputModel } from '../../types/input-output-types/post-types'
import { PostViewModel } from '../../types/db-types/post-db'
import { PaginatorBlogModel } from '../../types/paginator-types'
import { PostsQueryRepository } from '../posts/postsQueryRepository'
import { HttpStatuses } from '../../types/input-output-types/output-errors-type'
import { injectable } from 'inversify'

@injectable()
export class BlogsController {

  constructor (
    protected blogsService: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ){}

  async getBlogs(
    req: Request,
    res: Response<PaginatorBlogModel>
  ) {
    const paginationQueries = new PaginationQueries(req)
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries.getPaginationParams()
    console.log('all getBlogsController', pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, this)
    const blogs = await this.blogsQueryRepository.getAllBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    res.status(HttpStatuses.Success).json(blogs)
    return
  }

  async getBlogPosts(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const paginationQueries = new PaginationQueries(req)
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries.getPaginationParams()
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

  async createBlog(
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

  async changeBlog(
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

  async findBlog(
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

  async deleteBlog(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const blog = await this.blogsService.deleteById(req.params.id)
    if (blog.status !== 'Success') {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }

  async createBlogsPost(
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