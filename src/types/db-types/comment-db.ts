import { Document } from "mongoose";

export interface CommentModel extends Document {
  content: string;
  commentatorInfo: CommentatorInfo;
  postId: string;
  createdAt: Date;
}

export interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};
