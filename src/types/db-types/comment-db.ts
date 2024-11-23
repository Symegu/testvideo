import { ObjectId } from "mongodb"

export type CommentModel = {
  _id: ObjectId,
  content: string,
  commentatorInfo: CommentatorInfo,
  postId: string,
  createdAt: string
}

export type CommentViewModel = {
  id: string,
  content: string,
  commentatorInfo: CommentatorInfo,
  createdAt: string
}

export type CommentatorInfo = {
  userId: string,
  userLogin: string
}