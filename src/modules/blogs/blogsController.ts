import { Request, Response } from 'express'
import { paginationQueries } from "../other/paginationQueries"
import { blogsService } from "./blogsService"
import { ObjectId } from 'mongodb'
import { BlogViewModel } from '../../db/blog-db'
import { blogsRepository } from './blogsRepository'
import { BlogInputModel } from '../../input-output-types/blog-types'
import { PostInputModel } from '../../input-output-types/post-types'
import { PostViewModel } from '../../db/post-db'
import { PaginatorBlogModel } from '../other/paginator-types'

export const blogsController = {
  async getBlogsController(
    req: Request,
    res: Response<PaginatorBlogModel>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const blogs = await blogsService.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    res.status(200).json(blogs)
  },
  // async getBlogPostsController(
  //   req: Request<{id: string}>,
  //   res: Response
  // ) {
  //   const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
  //   const posts = await blogsService.getBlogPosts(req.params.id, pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
  //   res.status(200).json(posts)
  // },
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
    const { id } = req.params
    let blog = null
    if (ObjectId.isValid(id)) {
      console.log('objectid')
      blog = await blogsService.findByUUID(new ObjectId(id))
    } 
    if (!ObjectId.isValid(id) && typeof (id) === 'string') {
      console.log('id')
      blog = await blogsService.findById(id)
    }
    if (!blog) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(blog)
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
    const { id } = req.params
    let currentBlog = null
    if (ObjectId.isValid(id)) {
      currentBlog = await blogsService.findByUUID(new ObjectId(id))
    } else if (typeof (id) === 'string') {
      currentBlog = await blogsService.findById(id)
    }
    const createdPost = await blogsService.createBlogsPost(req.body, currentBlog!)
    if (!createdPost) {
      res.sendStatus(400)
      return
    }
    res.status(201).json(createdPost)
  },
}