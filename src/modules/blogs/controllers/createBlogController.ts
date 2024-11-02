import { Request, Response } from 'express'
import { BlogModel } from "../../../db/blog-db";
import { BlogInputType } from '../../../input-output-types/blog-types';
import { blogsRepository } from '../blogsRepository';

export const createBlogController = async (req: Request<BlogInputType>, res: Response<BlogModel | null>) => {
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
}