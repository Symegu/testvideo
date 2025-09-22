import { Document } from "mongoose"
import { LikeStatus } from "./comment-db";

export interface PostModel extends Document {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    newestLikes: Array<{
      addedAt: Date;
      userId: string;
      login: string;
      // description?: string;
    }>;
  }
}

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoViewModel;
};

export interface LikeDetailsViewModel {
  // description: string;
  addedAt: string;
  userId: string;
  login: string;
}

export interface ExtendedLikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Array<LikeDetailsViewModel>;
}

