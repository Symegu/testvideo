import { body } from "express-validator";

export const commentContentValidator = body('content')
  .trim()
  .isString()
  .withMessage('content is not string')
  .isLength({ min: 20, max: 300 })
  .withMessage('content length is more than 300 or less than 20')