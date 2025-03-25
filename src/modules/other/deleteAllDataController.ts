import { Request, Response } from "express"
import { BlogModelClass, CommentModelClass, PostModelClass, RefreshTokenModelClass, UserModelClass } from "../../db/mongoDb"

export const deleteAllDataController = async (req: Request, res: Response<any>) => {
  await BlogModelClass.deleteMany()
  await PostModelClass.deleteMany()
  await UserModelClass.deleteMany()
  await RefreshTokenModelClass.deleteMany()
  await CommentModelClass.deleteMany()
  res.sendStatus(204)
}