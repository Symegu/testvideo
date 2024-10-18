import { body } from "express-validator"
import { blogsRepository } from "../blogsRepository"
import { OutputErrorsType } from "../../../input-output-types/output-errors-type"
import { Request, Response, NextFunction } from "express"

export const nameValidator = body('name')
  .trim()
  .isString()
  .withMessage('name is not string')
  .isLength({ min: 1, max: 15 })
  .withMessage('name length is more than 15 or less than 1')

export const descriptionValidator = body('description')
  .trim()
  .isString()
  .withMessage('description is not string')
  .isLength({ min: 1, max: 500 })
  .withMessage('description length is more than 500 or less than 1')

export const websiteUrlValidator = body('websiteUrl')
  .trim()
  .isString()
  .withMessage('website url is not string')
  .isURL()
  .withMessage('website url does not match required pattern')
  .isLength({ min: 1, max: 100 })
  .withMessage('website url length is more than 100 or less than 1')

export const findBlogMiddleware = (req: Request<{id: string}>, res: Response<OutputErrorsType>, next: NextFunction) => {
  const blog = blogsRepository.findById(req.params.id)
  if(!blog) {
    res.sendStatus(404)
  }
  
  next()
}