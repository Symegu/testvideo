import { LikeStatus } from "../db-types/comment-db";

export type CommentInputModel = {
  content: string //maxlength: 300; minlength: 20
}


export type LikeInputModel = {
  likeStatus: LikeStatus; //string Send None if you want to unlike\undislike
}