import { Request, Response } from 'express'
import { securityService } from './securityService'
import { HttpStatuses, ResultStatus } from '../../types/input-output-types/output-errors-type'

export const securityController = {
  async getUserSessions(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken
    const sessions = await securityService.getUserSessions(currentRefreshToken)
    if (!sessions) {
      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }

    res.status(HttpStatuses.Success).json(sessions)
    return
  },

  async deleteAllUserSessions(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken
    const sessions = await securityService.deleteAllUserSessions(currentRefreshToken)
    if (!sessions) {
      res.sendStatus(HttpStatuses.Unauthorized)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
    return
  },

  async deleteUserSession(req: Request<{ id: string }>, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken
    const result = await securityService.deleteUserSession(currentRefreshToken, req.params.id)
    console.log('deleteUserSession req.params.id', req.params.id);

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