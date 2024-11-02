import { Request, Response } from 'express'
import { BlogModel } from "../../../db/blog-db";
import { BlogInputType } from '../../../input-output-types/blog-types';
import { OutputErrorsType } from "../../../input-output-types/output-errors-type";
import { blogsRepository } from '../blogsRepository';

export const createBlogController = async (req: Request<BlogInputType>, res: Response<BlogModel | OutputErrorsType>) => {
  const createdBlogId = (await blogsRepository.createBlog(req.body)).toString()
  const createdBlog = await blogsRepository.findById(createdBlogId)
  if (!createdBlog) {
    res.sendStatus(400)
    return
  } else {
    res.status(201).json(createdBlog)
  }
  
}