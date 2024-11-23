import { body } from "express-validator"
import { Request, Response, NextFunction } from "express"
import { OutputErrorsType } from "../../../types/input-output-types/output-errors-type"
import { blogsQueryRepository } from "../../blogs/blogsQueryRepository"
import { postsQueryRepository } from "../postsQueryRepository"

export const titleValidator = body('title')
  .trim()
  .isString()
  .withMessage('title is not string')
  .isLength({ min: 1, max: 30 })
  .withMessage('title length is more than 30 or less than 1')

export const shortDescriptionValidator = body('shortDescription')
  .trim()
  .isString()
  .withMessage('short description is not string')
  .isLength({ min: 1, max: 100 })
  .withMessage('short description length is more than 100 or less than 1')

export const contentValidator = body('content')
  .trim()
  .isString()
  .withMessage('content is not string')
  .isLength({ min: 1, max: 1000 })
  .withMessage('content length is more than 1000 or less than 1')

export const blogIdValidator = body('blogId')
  .trim()
  .isString()
  .withMessage('blog id is not string')
  .custom(async (blogId) => {
    const blog = await blogsQueryRepository.findById(blogId)
    if (!blog) {
      throw new Error('post with this blog id does not exist')
    }
    return true
  })
// export const findPostMiddleware = (req: Request<{id: string}>, res: Response<OutputErrorsType>, next: NextFunction) => {
//     const post = postsQueryRepository.findById(req.params.id)
//     if(!post) {
//       res.sendStatus(404)
//     }
    
//     next()
//   }