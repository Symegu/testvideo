import { body } from "express-validator"
import { LikeStatus } from "../../../types/db-types/comment-db"

export const likeStatusValidator = body('likeStatus')
  .trim()
  .isString()
  .withMessage('like status is not string')
  .custom((value) => Object.values(LikeStatus).includes(value))
  .withMessage('likeStatus is not valid')