import { ObjectId } from "mongodb"
import { CommentModelClass } from "../../db/mongoDb"
import { PaginatorCommentsModel } from "../../types/paginator-types"
import { CommentModel, CommentViewModel } from "../../types/db-types/comment-db"

export const commentsQueryRepository = {
  async getCommentsOfPost(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null,
    postId?: string | null
  ): Promise<PaginatorCommentsModel> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    if (postId) {
      filter.postId = { $regex: postId }
    }
    console.log('getComments', filter)
    const dbComments = await CommentModelClass
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .lean()

    console.log(dbComments, 'dbComments');
    const mappedComments: CommentViewModel[] = dbComments.map(comment => {
      return this.mapCommentToOutput(comment)
    })
    console.log(mappedComments, 'mappedComments');

    const commentsCount = await this.getCommentsCount(searchNameTerm, postId)
    const comments = {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: commentsCount,
      items: mappedComments
    }

    return comments
  },

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
  },

  async findById(
    id: string
  ): Promise<CommentViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id);
    const comment = await CommentModelClass.findOne(
      { _id }
    );
    if (!comment) {
      return null;
    }

    return this.mapCommentToOutput(comment)
  },

  async findComment(
    id: string
  ): Promise<CommentModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id);
    const comment = await CommentModelClass.findOne(
      { _id }
    );
    if (!comment) {
      return null;
    }

    return comment
  },

  mapCommentToOutput(comment: CommentModel) {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      createdAt: comment.createdAt
    } as CommentViewModel
  }
}