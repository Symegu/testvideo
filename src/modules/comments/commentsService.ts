import { CommentModel, CommentViewModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { commentsQueryRepository } from "./commentsQueryRepository"
import { commentsRepository } from "./commentsRepository"

export const commentsService = {
  async createComment(
    comment:CommentInputModel,
    userId:string,
    userLogin:string,
    postId: string
  ): Promise<string | null> {
    const newCommentId = await commentsRepository.createComment(comment, userId, userLogin, postId)
    if(!newCommentId) {
      return null
    }

    return newCommentId
  },

  async changeById(
    comment: CommentInputModel,
    id: string,
  ): Promise<boolean | null> {
    const currentComment: CommentModel | null =
      await commentsQueryRepository.findComment(id)
    if (!currentComment) {
      return null
    }
    const changeStatus = await commentsRepository.changeById(comment, currentComment, id)
    return changeStatus
  },

  async deleteComment(
    id:string
  ): Promise<boolean> {
    const res = await commentsRepository.deleteById(id)
    return res
  }
}