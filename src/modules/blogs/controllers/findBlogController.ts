import { BlogDBType } from "../../../db/blog-db"
import { Request, Response } from 'express'
// import { OutputErrorsType } from "../../../input-output-types/output-errors-type"
import { blogsRepository } from "../blogsRepository"

export const findBlogController = (req: Request<{ id: string }>, res: Response<BlogDBType>) => {
  const blog = blogsRepository.findById(req.params.id)
  if (!blog) {
    res.sendStatus(404)
  }
  res.status(200).json(blog)
}