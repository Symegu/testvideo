import { CommentViewModel } from "../../types/db-types/comment-db"
import { PostViewModel } from "../../types/db-types/post-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { postsQueryRepository } from "../posts/postsQueryRepository"
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
    id: string
  ): Promise<boolean | null> {
    const currentPost: PostViewModel | null =
      await postsQueryRepository.findById(id)
    const currentComment: CommentViewModel | null =
      await commentsQueryRepository.findById(id)
    if (!currentComment || !currentPost) {
      return null
    }
    const changedComment = await commentsRepository.changeById(comment, currentComment, id)
    return changedComment
  },

  async deleteComment(
    id:string
  ): Promise<boolean> {
    const res = await commentsRepository.deleteById(id)
    return res
  }
}