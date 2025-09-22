import { Document } from "mongoose";

export interface CommentModel extends Document {
  content: string;
  commentatorInfo: CommentatorInfo;
  postId: string;
  createdAt: Date;
  likesInfo: LikesInfoModel;
}

export interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
}

export interface LikesInfoModel {
  likesCount: number;
  dislikesCount: number;
}

export interface LikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export interface CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
}