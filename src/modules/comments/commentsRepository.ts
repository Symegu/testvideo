import { CommentModel, LikeStatus } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { CommentModelClass, LikeModelClass } from "../../db/mongoDb"
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
    const newComment: CommentModel = new CommentModelClass({
      _id: new ObjectId(),
      postId: postId,
      content: comment.content,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin,
      },
      createdAt: Date.now(),
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
      }
    })
    const res = await newComment.save()

    return res.id.toString()
  }

  async changeById(
    comment: CommentInputModel,
    commentId: string
  ): Promise<boolean> {
    const res = await CommentModelClass.updateOne(
      { _id: commentId },
      { $set: { content: comment.content } }
    );
  
    return res.matchedCount === 1;
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await CommentModelClass.deleteOne({ _id: id })
    return res.deletedCount === 1
  }

  async createLike(
    commentId: string,
    userId: string,
    userLogin: string,
    likeStatus: LikeStatus
  ) {
    const newLike = new LikeModelClass({
      parentId: commentId,
      userId: userId,
      userLogin: userLogin,
      status: likeStatus,
      createdAt: Date.now()
    })
    const res = await newLike.save()

    return res.id.toString()
  }

  async deleteLike(
    commentId: string,
    userId: string
  ) {
    const res = await LikeModelClass.deleteOne({ parentId: commentId, userId })

    return res.deletedCount === 1
  }

  async updateLike(
    commentId: string,
    userId: string,
    likeStatus: LikeStatus
  ) {
    const res = await LikeModelClass.updateOne({ parentId: commentId, userId }, { $set: { status: likeStatus, addedAt: new Date() }})

    return res.matchedCount === 1
  }

  async updateCommentLikesCount(
    commentId: string,
    likes: number,
    dislikes: number
  ) {
    const res = await CommentModelClass.updateOne({ _id: commentId }, {$set: {'likesInfo.likesCount': likes, 'likesInfo.dislikesCount': dislikes}})

    return res.matchedCount === 1
  }
}