import { injectable } from "inversify"
import { CommentModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { CommentsQueryRepository } from "./commentsQueryRepository"
import { CommentsRepository } from "./commentsRepository"

@injectable()
export class CommentsService {

  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository
  ){}
  
  async createComment(
    comment:CommentInputModel,
    userId:string,
    userLogin:string,
    postId: string
  ): Promise<string | null> {
    const newCommentId = await this.commentsRepository.createComment(comment, userId, userLogin, postId)
    if(!newCommentId) {
      return null
    }

    return newCommentId
  }

  async changeById(
    comment: CommentInputModel,
    id: string,
  ): Promise<boolean | null> {
    const currentComment: CommentModel | null =
      await this.commentsQueryRepository.findComment(id)
    if (!currentComment) {
      return null
    }
    const changeStatus = await this.commentsRepository.changeById(comment, currentComment, id)
    return changeStatus
  }

  async deleteComment(
    id:string
  ): Promise<boolean> {
    const res = await this.commentsRepository.deleteById(id)
    return res
  }
}