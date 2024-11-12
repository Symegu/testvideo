import { Request, Response } from 'express'
import { paginationQueries } from "../other/paginationQueries"
import { blogsService } from "./blogsService"
import { ObjectId } from 'mongodb'
import { BlogModel } from '../../db/blog-db'
import { blogsRepository } from './blogsRepository'
import { BlogInputType } from '../../input-output-types/blog-types'

export const blogsController = {
  async getBlogsController(
    req: Request,
    res: Response
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = paginationQueries(req)
    const blogs = await blogsService.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    res.status(200).json(blogs)
  },
  async createBlogController (
    req: Request<BlogInputType>,
    res: Response<BlogModel | null>
  ) {
    const createdBlogId = await blogsRepository.createBlog(req.body)
    if(!createdBlogId) {
      res.sendStatus(404)
      return
    }
    const createdBlog = await blogsRepository.findByUUID(createdBlogId)
    if (!createdBlog) {
      res.sendStatus(400)
      return
    } 
      res.status(201).json(createdBlog)
  },
  async changeBlogController (
    req: Request<{id: string}, any, BlogInputType>,
    res: Response
  ) {
    const updateStatus = await blogsRepository.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },
  async findBlogController (
    req: Request<{ id: string | ObjectId}>,
    res: Response<BlogModel>
  ) {
    const { id } = req.params
    let blog = null
    if (ObjectId.isValid(id)) {
      blog = await blogsRepository.findByUUID(new ObjectId(id))
    } else if (typeof(id)==='string') {
      blog = await blogsRepository.findById(id)
    }
    if (!blog) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(blog)
  },
  async deleteBlogController (
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
}