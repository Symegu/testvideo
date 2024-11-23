import { Request, Response } from 'express'
import { CommentViewModel } from "../../types/db-types/comment-db"
import { CommentInputModel } from "../../types/input-output-types/comment-types"
import { commentsService } from './commentsService'
import { commentsQueryRepository } from './commentsQueryRepository'

export const commentsController = {
  async changeComment(
    req: Request<({ id: string }), any, CommentInputModel>,
    res: Response
  ) {
    const updateStatus = await commentsService.changeById(req.body, req.params.id)
    if (!updateStatus) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(204)
  },

  async getComment(
    req: Request<{id: string}>,
    res: Response<CommentViewModel>
  ) {
    const comment = await commentsQueryRepository.findById(req.params.id)
    if(!comment) {
      res.sendStatus(404)
      return
    }

    res.status(200).json(comment)
  },

  async deleteComment(req: Request<{ id: string }>, res: Response) {
    const deletedComment = await commentsService.deleteComment(req.params.id)

    if (!deletedComment) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
}