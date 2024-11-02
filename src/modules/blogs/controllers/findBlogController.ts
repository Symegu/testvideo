import { BlogModel } from "../../../db/blog-db"
import { Request, Response } from 'express'
// import { OutputErrorsType } from "../../../input-output-types/output-errors-type"
import { blogsRepository } from "../blogsRepository"

export const findBlogController = async (req: Request<{ id: string }>, res: Response<BlogModel>) => {
  const blog = await blogsRepository.findById(req.params.id)
  if (!blog) {
    res.sendStatus(404)
    return
  }
  res.status(200).json(blog)
}