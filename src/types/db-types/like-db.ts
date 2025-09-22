import { Document } from "mongoose";
import { LikeStatus } from "./comment-db";

export interface LikeModel extends Document {
    parentId: string;
    userId: string;
    userLogin: string;
    status: LikeStatus;
    createdAt: Date;
}