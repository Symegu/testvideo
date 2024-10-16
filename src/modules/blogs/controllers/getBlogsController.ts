import {BlogDBType} from "../../../db/blog-db"
import {Request, Response} from 'express'
import {db} from "../../../db/db"

export const getBlogsController = (req: Request, res: Response<BlogDBType[]>) => {
  const blogs = db.blogs
  res.status(200).json(blogs)
}