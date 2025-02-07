import { Request, Response } from 'express'
import { CommentViewModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { commentsService } from './commentsService'
import { commentsQueryRepository } from './commentsQueryRepository'
import { HttpStatuses } from '../../types/input-output-types/output-errors-type'

export const commentsController = {
  async changeComment(
    req: Request<({ id: string }), any, CommentInputModel>,
    res: Response
  ) {
    const comment: CommentViewModel | null = await commentsQueryRepository.findById(req.params.id)
    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    if (comment.commentatorInfo.userId !== req.userId) {
      res.sendStatus(HttpStatuses.Forbidden)
      return
    }
    const updateStatus = await commentsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    res.sendStatus(HttpStatuses.NoContent)
  },

  async getComment(
    req: Request<{ id: string }>,
    res: Response<CommentViewModel>
  ) {
    const comment = await commentsQueryRepository.findById(req.params.id)
    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.status(HttpStatuses.Success).json(comment)
  },

  async deleteComment(req: Request<{ id: string }>, res: Response) {
    const comment: CommentViewModel | null = await commentsQueryRepository.findById(req.params.id)
    if (!comment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }
    if (comment.commentatorInfo.userId !== req.userId) {
      res.sendStatus(HttpStatuses.Forbidden)
      return
    }
    const deletedComment = await commentsService.deleteComment(req.params.id)
    if (!deletedComment) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
  }
}