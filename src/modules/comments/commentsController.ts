import { Request, Response } from 'express'
import { CommentViewModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { CommentsService } from './commentsService'
import { CommentsQueryRepository } from './commentsQueryRepository'
import { HttpStatuses, ResultStatus } from '../../types/input-output-types/output-errors-type'
import { inject, injectable } from 'inversify'
import { JwtService } from '../other/jwtService'
import { LikesService } from '../likes/likesService';

@injectable()
export class CommentsController {

  constructor(
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(JwtService) protected likesService: LikesService
  ) { }

  async changeComment(
    req: Request<({ id: string }), any, CommentInputModel>,
    res: Response
  ) {
    const comment: CommentViewModel | null = await this.commentsQueryRepository.findById(req.params.id)
    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    if (comment.commentatorInfo.userId !== req.userId) {
      res.sendStatus(HttpStatuses.Forbidden)
      return
    }
    const updateStatus = await this.commentsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  }

  async getComment(
    req: Request<{ id: string }>,
    res: Response<CommentViewModel>
  ) {
    const commentId = req.params.id;
    
    const result = await this.commentsService.findComment(commentId, null);
    
    if (result.status !== ResultStatus.Success || !result.data) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    const userId = req.userId ?? null;
    console.log('getComment userId', userId);

    if (userId!=null) {
      const status = await this.likesService.calculateMyStatus(commentId, userId)

      if (status.status === ResultStatus.Success && status.data) {
        result.data.likesInfo.myStatus = status.data
      }
      
    }
  
    res.status(HttpStatuses.Success).json(result.data)
    return
  }
  

  async deleteComment(req: Request<{ id: string }>, res: Response) {
    const comment: CommentViewModel | null = await this.commentsQueryRepository.findById(req.params.id)
    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    if (comment.commentatorInfo.userId !== req.userId) {
      res.sendStatus(HttpStatuses.Forbidden)
      return
    }
    const deletedComment = await this.commentsService.deleteComment(req.params.id)
    if (!deletedComment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
  }

  async setLikeStatus(req: Request<{ id: string }>, res: Response) {    
    const likeStatus = req.body.likeStatus
    console.log('setLikeStatus', req.params.id, req.userId, likeStatus);
    const comment = await this.commentsQueryRepository.findComment(req.params.id, req.userId!)

    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    const result = await this.commentsService.setLikeStatus(likeStatus, req.params.id, req.userId!);

    if (result.status === ResultStatus.Forbidden) {
      res.sendStatus(HttpStatuses.Forbidden)
      return
    }
    if (result.status === ResultStatus.NotFound) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  }
}