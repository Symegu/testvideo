import {Request, Response} from 'express'
import {BlogDBType, BlogInputType} from "../../../db/blog-db";
import {OutputErrorsType} from "../../../input-output-types/output-errors-type";

export const createBlogController = (req: Request<BlogInputType>, res: Response<BlogDBType | OutputErrorsType>) => {
  const createdBlog = {}
  res.status(201).json(createdBlog)
}