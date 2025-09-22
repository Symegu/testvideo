// src/modules/likes/likesService.ts
import { injectable, inject } from "inversify";
import { LikesRepository } from './likesRepository';
import { LikeStatus } from "../../types/db-types/comment-db";
import { ResultStatus } from "../../types/input-output-types/output-errors-type";

@injectable()
export class LikesService {
  constructor(@inject(LikesRepository) protected likesRepository: LikesRepository) { }

  /**
   * Универсальный сеттер статуса лайка для parentId (post/comment)
   * updateParentCounts - callback, который обязан обновить агрегированный документ (например, comment или post)
   * и вернуть true/false (успешно/неуспешно).
   */
  async setLikeStatus(
    parentId: string,
    userId: string,
    userLogin: string,
    likeStatus: LikeStatus,
    updateParentCounts: (likes: number, dislikes: number) => Promise<boolean>
  ) {
    const existing = await this.likesRepository.findLike(parentId, userId);

    if (likeStatus === LikeStatus.None) {
      if (existing) {
        await this.likesRepository.deleteLike(parentId, userId);
      }
    } else {
      if (!existing) {
        await this.likesRepository.createLike(parentId, userId, userLogin, likeStatus);
      } else {
        if (existing.status !== likeStatus) {
          await this.likesRepository.updateLike(parentId, userId, likeStatus);
        }
        // если existing.status === likeStatus => noop
      }
    }

    const { likesCount, dislikesCount } = await this.likesRepository.countLikes(parentId);
    const updated = await updateParentCounts(likesCount, dislikesCount);

    if (!updated) {
      return { status: ResultStatus.NotFound, data: null };
    }

    return { status: ResultStatus.Success, data: null };
  }

  async calculateMyStatus(
    id: string,
    userId: string,
  ) {
    const result = await this.likesRepository.findLike(id, userId)
    if (!result) {
      return {
        status: ResultStatus.NotFound,
        data: LikeStatus.None
      }
    }
    return {
      status: ResultStatus.Success,
      data: result.status
    }
  }
}
