import { BlogDBType } from "../../../db/blog-db"
import { Request, Response } from 'express'
import { blogsRepository } from "../blogsRepository"

export const getBlogsController = (req: Request, res: Response<BlogDBType[]>) => {
  const blogs = blogsRepository.getBlogs()
  res.status(200).json(blogs)
}