import { Request, Response } from 'express'
import { paginationQueries } from "../other/paginationQueries"
import { blogsService } from "./blogsService"
import { BlogViewModel } from '../../db/blog-db'
import { blogsRepository } from './blogsRepository'
import { BlogInputModel } from '../../input-output-types/blog-types'
import { PostInputModel } from '../../input-output-types/post-types'
import { PostViewModel } from '../../db/post-db'
import { PaginatorBlogModel } from '../other/paginator-types'
import { blogsQueryRepository } from './blogsQueryRepository'
import { postsService } from '../posts/postsService'
import { postsQueryRepository } from '../posts/postsQueryRepository'

export const blogsController = {
  async getBlogsController(
    req: Request,
    res: Response<PaginatorBlogModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const blogs = await blogsQueryRepository.getAllBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    res.status(200).json(blogs)
    return
  },
  async getBlogPostsController(
    req: Request<{id: string}>,
    res: Response
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const blog = await blogsQueryRepository.findById(req.params.id)
    if(!blog) {
      res.sendStatus(404)
    }
    const posts = await postsQueryRepository.getAllPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, req.params.id)
    if (!posts) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(posts)
  },
  async createBlogController(
    req: Request<BlogInputModel>,
    res: Response<BlogViewModel | null>
  ) {
    const createdBlog = await blogsService.createBlog(req.body)
    if (!createdBlog) {
      res.sendStatus(400)
      return
    }
    res.status(201).json(createdBlog)
  },

  async changeBlogController(
    req: Request<{ id: string }, any, BlogInputModel>,
    res: Response<boolean>
  ) {
    const updateStatus = await blogsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },

  async findBlogController(
    req: Request<{ id: string }>,
    res: Response<BlogViewModel>
  ) {
    const blog = await blogsQueryRepository.findById(req.params.id)
    
    console.log(blog)
    if (!blog) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(blog)
    return
  },

  async deleteBlogController(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const blog = await blogsRepository.deleteById(req.params.id)
    if (!blog) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },

  async createBlogsPostController(
    req: Request<{ id: string }, PostInputModel>,
    res: Response<PostViewModel | null>
  ) {
    const currentBlog = await blogsQueryRepository.findById(req.params.id)
    if (!currentBlog) {
      console.log('createBlogsPostController currentBlog',currentBlog);
      res.sendStatus(404)
      return
    }

    const createdPost = await blogsService.createBlogsPost(req.body, currentBlog)
    if (!createdPost) {
      res.sendStatus(400)
      return
    }
    res.status(201).json(createdPost)
  },
}