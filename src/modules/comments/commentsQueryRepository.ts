import { CommentModelClass, LikeModelClass } from "../../db/mongoDb"
import { PaginatorCommentsModel } from "../../types/paginator-types"
import { CommentModel, CommentViewModel, LikesInfoViewModel, LikeStatus } from "../../types/db-types/comment-db"
import { injectable } from "inversify"
import { LikeModel } from "../../types/db-types/like-db"

@injectable()
export class CommentsQueryRepository {

  async getCommentsOfPost(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null,
    postId: string | null,
    userId: string | null
  ): Promise<PaginatorCommentsModel> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    if (postId) {
      // filter.postId = { $regex: postId }
      filter.postId = postId
      //
    }
    const comments = await CommentModelClass
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
    const commentsCount = await this.getCommentsCount(searchNameTerm, postId)
    console.log(comments, 'dbComments <----------------------');
    const items: CommentViewModel[] = await Promise.all(
      comments.map(async (comment) => {
        // const likesCount = await LikeModelClass.countDocuments({ commentId: comment._id, status: 'Like' });
        // const dislikesCount = await LikeModelClass.countDocuments({ commentId: comment._id, status: 'Dislike' });
        const likesCount = comment.likesInfo?.likesCount ?? 0;
        const dislikesCount = comment.likesInfo?.dislikesCount ?? 0;
        //
        let myStatus: LikeStatus = LikeStatus.None
        if (userId) {
          const userLike = await LikeModelClass.findOne({ commentId: comment._id, userId });
          if (userLike) myStatus = userLike.status;
        }
  
        return {
          id: comment.id.toString(),
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
          },
          createdAt: comment.createdAt.toISOString(),
          likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus,
          },
        };
      })
    )
    console.log(items, 'dbComments mapped <----------------------');
    return {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: commentsCount,
      items: items
    }
  }

  async getCommentsCount(
    searchNameTerm: string | null,
    postId?: string | null
  ): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    if (postId) {
      filter.postId = { $regex: postId }
    }
    const count = await CommentModelClass.countDocuments(filter)
    console.log(count, 'count');
    return count
  }

  async findById(
    id: string
  ): Promise<CommentViewModel | null> {
    
    const comment = await CommentModelClass.findOne(
      { _id: id }
    )

    if (!comment) {
      return null
    }    
    
    return await this.mapCommentToOutput(comment, LikeStatus.None)
  }

  async findComment(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
    const comment = await CommentModelClass.findById(commentId);
    if (!comment) return null;
  
    const likesCount = await LikeModelClass.countDocuments({ parentId: commentId, status: 'Like' });
    const dislikesCount = await LikeModelClass.countDocuments({ parentId: commentId, status: 'Dislike' });
  
    let myStatus: LikeStatus = LikeStatus.None;
    if (userId) {
      const userLike = await LikeModelClass.findOne({ parentId: commentId, userId });
      if (userLike) myStatus = userLike.status;
    }
  
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
      },
    };
  }

  // async findLike(
  //   commentId: string,
  //   userId: string
  // ) {
  //   const likes = await LikeModelClass.findOne({ parentId: commentId, userId: userId })
  //   return likes
  // }
  
  async countLikes(commentId: string) {
    const likes = await LikeModelClass.countDocuments({ parentId: commentId, status: LikeStatus.Like })
    const dislikes = await LikeModelClass.countDocuments({ parentId: commentId, status: LikeStatus.Dislike })
    return { likesCount: likes, dislikesCount: dislikes }
  }
  
  async mapCommentToOutput(
    comment: CommentModel,
    likeStatus: LikeStatus,
  ) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: likeStatus,
      },
    } as CommentViewModel
  }
  
  async mapLikesToOutput(like: LikeModel) {
    const { likesCount, dislikesCount } = await this.countLikes(like.parentId)
    return {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: like.status.toString(),
    } as LikesInfoViewModel
  }
}