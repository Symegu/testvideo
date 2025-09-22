import { injectable } from "inversify"
import { LikeStatus } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { CommentsQueryRepository } from "./commentsQueryRepository"
import { CommentsRepository } from "./commentsRepository"
import { UsersQueryRepository } from '../users/usersQueryRepository';
import { ResultStatus } from "../../types/input-output-types/output-errors-type"
import { LikesService } from '../likes/likesService';

@injectable()
export class CommentsService {

  constructor(
    protected commentsRepository: CommentsRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected likesService: LikesService
  ) { }

  async createComment(
    comment: CommentInputModel,
    userId: string,
    userLogin: string,
    postId: string
  ): Promise<string | null> {
    const newCommentId = await this.commentsRepository.createComment(comment, userId, userLogin, postId)
    if (!newCommentId) {
      return null
    }

    return newCommentId
  }

  async changeById(
    comment: CommentInputModel,
    id: string,
  ): Promise<boolean | null> {
    const currentComment =
      await this.commentsQueryRepository.findById(id)
    if (!currentComment) {
      return null
    }
    const changeStatus = await this.commentsRepository.changeById(comment, id)
    return changeStatus
  }

  async deleteComment(
    id: string
  ): Promise<boolean> {
    const res = await this.commentsRepository.deleteById(id)
    return res
  }

  async setLikeStatus(
    likeStatus: LikeStatus,
    commentId: string,
    userId: string,
  ) {
    const user = await this.usersQueryRepository.findById(userId)
    if (!user) {
      return {
        status: ResultStatus.Forbidden,
        data: null
      }
    }

    const comment = await this.commentsQueryRepository.findComment(commentId, userId)
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null
      }
    }

    // const existingLike = await this.commentsQueryRepository.findLike(commentId, userId)

    // if (likeStatus === LikeStatus.None) {
    //   await this.commentsRepository.deleteLike(commentId, userId)
    //   if (existingLike?.status === LikeStatus.Dislike) {
    //     await this.commentsRepository.updateCommentLikesCount(commentId, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount - 1)
    //   } else {
    //     await this.commentsRepository.updateCommentLikesCount(commentId, comment.likesInfo.likesCount - 1, comment.likesInfo.dislikesCount)
    //   }
    //   return {
    //     status: ResultStatus.Success,
    //     data: null
    //   }
    // }

    // if (!existingLike) {
    //   await this.commentsRepository.createLike(commentId, userId, user.login, likeStatus)
    // } else {
    //   await this.commentsRepository.updateLike(commentId, userId, likeStatus)
    // }

    // const { likesCount, dislikesCount } = await this.commentsQueryRepository.countLikes(commentId)
    // const count = await this.commentsRepository.updateCommentLikesCount(commentId, likesCount, dislikesCount)
    // if (!count) {
    //   return {
    //     status: ResultStatus.NotFound,
    //     data: null
    //   }
    // }
    // return {
    //   status: ResultStatus.Success,
    //   data: null
    // }

    return await this.likesService.setLikeStatus(
      commentId,
      userId,
      user.login,
      likeStatus,
      async (likesCount: number, dislikesCount: number) => {
        // updateCommentLikesCount возвращает boolean — оставляем как раньше
        return await this.commentsRepository.updateCommentLikesCount(commentId, likesCount, dislikesCount)
      }
    )
  }

  async findComment(
    commentId: string,
    userId: string | null
  ) {
    console.log('findComment service -----------------------> ', commentId, userId);

    const comment = await this.commentsQueryRepository.findComment(commentId, userId);
    if (!comment) {
      return { status: ResultStatus.NotFound, data: null };
    }

    return {
      status: ResultStatus.Success,
      data: comment
    };
  }

  async calculateMyStatus(
    commentId: string,
    userId: string,
  ) {
    const result = await this.likesService.calculateMyStatus(commentId, userId)
    if (!result) {
      return {
        status: ResultStatus.NotFound,
        data: LikeStatus.None
      }
    }
    return {
      status: ResultStatus.Success,
      data: result.status
    }
  }
}