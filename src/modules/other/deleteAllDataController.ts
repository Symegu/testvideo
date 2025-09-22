import { Request, Response } from "express"
import { BlogModelClass, CommentModelClass, LikeModelClass, PasswordRecoveryModelClass, PostModelClass, RefreshTokenModelClass, UserModelClass } from "../../db/mongoDb"

export class DeleteAllDataController {

  async deleteAllData(req: Request, res: Response<any>) {
    await BlogModelClass.deleteMany()
    await PostModelClass.deleteMany()
    await UserModelClass.deleteMany()
    await RefreshTokenModelClass.deleteMany()
    await CommentModelClass.deleteMany()
    await PasswordRecoveryModelClass.deleteMany()
    await LikeModelClass.deleteMany()
    res.sendStatus(204)
  }
}