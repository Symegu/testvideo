// src/modules/likes/likesRepository.ts
import { injectable } from "inversify";
import { LikeModelClass } from "../../db/mongoDb";
import { LikeStatus } from "../../types/db-types/comment-db";
import { LikeModel } from "../../types/db-types/like-db";

@injectable()
export class LikesRepository {
  async findLike(parentId: string, userId: string): Promise<LikeModel | null> {
    return LikeModelClass.findOne({ parentId, userId }).exec();
  }

  async createLike(parentId: string, userId: string, userLogin: string, likeStatus: LikeStatus): Promise<string> {
    const newLike = new LikeModelClass({
      parentId,
      userId,
      userLogin,
      status: likeStatus,
      createdAt: new Date()
    });
    const res = await newLike.save();
    return res.id.toString();
  }

  async updateLike(parentId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
    const res = await LikeModelClass.updateOne(
      { parentId, userId },
      { $set: { status: likeStatus, createdAt: new Date() } }
    );
    // mongoose versions differ: use matchedCount or n
    return (res as any).matchedCount === 1 || (res as any).n === 1;
  }

  async deleteLike(parentId: string, userId: string): Promise<boolean> {
    const res = await LikeModelClass.deleteOne({ parentId, userId });
    return (res as any).deletedCount === 1 || (res as any).n === 1;
  }

  async countLikes(parentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
    const likes = await LikeModelClass.countDocuments({ parentId, status: LikeStatus.Like });
    const dislikes = await LikeModelClass.countDocuments({ parentId, status: LikeStatus.Dislike });
    return { likesCount: likes, dislikesCount: dislikes };
  }
  
  async getNewestLikes(parentId: string, limit = 3) {
    const docs = await LikeModelClass.find({ parentId, status: LikeStatus.Like })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return docs.map(d => ({
      addedAt: (d.createdAt as Date).toISOString(),
      userId: d.userId,
      login: d.userLogin ?? ''
    }))
  }

}
