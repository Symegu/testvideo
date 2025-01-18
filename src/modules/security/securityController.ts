import { Request, Response } from 'express'
import { securityService } from './securityService'

export const securityController = {
  async getUserSessions(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken
    const sessions = await securityService.getUserSessions(currentRefreshToken)
    if (!sessions) {
      res.sendStatus(401)
      return
    }

    res.status(200).json(sessions)
    return
  },

  async deleteAllUserSessions(req: Request, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken
    const sessions = await securityService.deleteAllUserSessions(currentRefreshToken)
    if (!sessions) {
      res.sendStatus(401)
      return
    }

    res.sendStatus(204)
    return
  },

  async deleteUserSession(req: Request<{ id: string }>, res: Response) {
    const currentRefreshToken = req.cookies.refreshToken
    const session = await securityService.deleteUserSession(currentRefreshToken, req.params.id)
    console.log('deleteUserSession req.params.id', req.params.id);

    if (!session) {
      res.sendStatus(401)
      return
    }

    res.sendStatus(204)
    return
  }
}