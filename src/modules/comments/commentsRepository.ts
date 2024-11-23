import { CommentModel, CommentViewModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { commentsCollection } from "../../db/mongoDb"
import { ObjectId } from "mongodb"


export const commentsRepository = {
  async createComment(
    comment: CommentInputModel,
    userId: string,
    userLogin: string,
    postId: string
  ): Promise<string> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newComment: CommentModel = {
      _id: new ObjectId(),
      content: comment.content,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin,
      },
      postId: postId,
      createdAt: createdAtISO
    }
    const res = await commentsCollection.insertOne(newComment)

    return res.insertedId.toString()
  },

  async changeById(
    comment: CommentInputModel,
    currentComment: CommentViewModel,
    commentId: string
  ): Promise<boolean> {
    const changedComment: CommentModel = {
      _id: new ObjectId(commentId),
      content: comment.content,
      commentatorInfo: {
        userId: currentComment.commentatorInfo.userId,
        userLogin: currentComment.commentatorInfo.userLogin,
      },
      postId: currentComment.postId,
      createdAt: currentComment.createdAt
    }
    const res = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) }, { $set: { ...changedComment } }
    )

    return res.matchedCount === 1
  },

  async deleteById(id: string): Promise<boolean> {
    const res = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    return res.deletedCount === 1
  },
}