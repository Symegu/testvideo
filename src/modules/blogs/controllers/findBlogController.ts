import {BlogDBType} from "../../../db/blog-db"
import {Request, Response} from 'express'
import {db} from "../../../db/db"
import {OutputErrorsType} from "../../../input-output-types/output-errors-type"

export const getBlogsController = (req: Request<{id: string}>, res: Response<BlogDBType | OutputErrorsType>) => {
  const blog = db.blogs.find(blog => blog.id === req.params.id)
  if(!blog) {
    res.sendStatus(404)
  }
  res.status(200).json(blog)
}