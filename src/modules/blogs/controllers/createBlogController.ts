import { Request, Response } from 'express'
import { BlogDBType } from "../../../db/blog-db";
import { BlogInputType } from '../../../input-output-types/blog-types';
import { OutputErrorsType } from "../../../input-output-types/output-errors-type";
import { blogsRepository } from '../blogsRepository';

export const createBlogController = (req: Request<BlogInputType>, res: Response<BlogDBType | OutputErrorsType>) => {
  const createdBlogId = blogsRepository.createBlog(req.body)
  const createdBlog = blogsRepository.findById(createdBlogId)
  res.status(201).json(createdBlog)
}