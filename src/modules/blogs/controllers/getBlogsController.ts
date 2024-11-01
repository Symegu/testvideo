import { BlogModel } from "../../../db/blog-db"
import { Request, Response } from 'express'
import { blogsRepository } from "../blogsRepository"

export const getBlogsController = async (req: Request, res: Response<BlogModel[]>) => {
  const blogs = await blogsRepository.getBlogs()
  res.status(200).json(blogs)
}