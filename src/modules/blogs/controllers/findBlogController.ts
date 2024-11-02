import { BlogModel } from "../../../db/blog-db"
import { Request, Response } from 'express'
// import { OutputErrorsType } from "../../../input-output-types/output-errors-type"
import { blogsRepository } from "../blogsRepository"
import { ObjectId } from "mongodb"

export const findBlogController = async (req: Request<{ id: string | ObjectId}>, res: Response<BlogModel>) => {
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
}