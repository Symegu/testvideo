import { CommentModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { CommentModelClass } from "../../db/mongoDb"
import { ObjectId } from "mongodb"
import { injectable } from "inversify"

@injectable()
export class CommentsRepository {

  async createComment(
    comment: CommentInputModel,
    userId: string,
    userLogin: string,
    postId: string
  ): Promise<string> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow)
    const newComment = new CommentModelClass ({
      _id: new ObjectId(),
      postId: postId,
      content: comment.content,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin,
      },
      createdAt: createdAtISO
    })
    const res = await newComment.save()

    return res.id.toString()
  }

  async changeById(
    comment: CommentInputModel,
    currentComment: CommentModel,
    commentId: string
  ): Promise<boolean> {
    const changedComment = {
      postId: currentComment.postId,
      content: comment.content,
      commentatorInfo: {
        userId: currentComment.commentatorInfo.userId,
        userLogin: currentComment.commentatorInfo.userLogin,
      },
      createdAt: currentComment.createdAt
    }
    const res = await CommentModelClass.updateOne(
      { _id: commentId }, { $set: { ...changedComment } }
    )

    return res.matchedCount === 1
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await CommentModelClass.deleteOne({ _id: id })
    return res.deletedCount === 1
  }
}