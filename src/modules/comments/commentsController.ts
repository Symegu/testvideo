import { Request, Response } from 'express'
import { CommentViewModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { CommentsService } from './commentsService'
import { CommentsQueryRepository } from './commentsQueryRepository'
import { HttpStatuses } from '../../types/input-output-types/output-errors-type'
import { injectable } from 'inversify'

@injectable()
export class CommentsController {

  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository
  ){}

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
    const comment = await this.commentsQueryRepository.findById(req.params.id)
    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.status(HttpStatuses.Success).json(comment)
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
}