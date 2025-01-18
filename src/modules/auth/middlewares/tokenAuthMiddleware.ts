import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../../../settings'
import jwt from 'jsonwebtoken'
import { jwtService } from '../../other/jwtService';

export const tokenAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers['authorization']) {
    res.sendStatus(401)
    return
  }
  const token = req.headers['authorization'].split(' ')[1]
  const authType = req.headers['authorization'].split(' ')[0]
  if (authType !== 'Bearer') {
    res.sendStatus(401)
    return
  }

  if (!token) {
    res.status(401).json({ message: "invalid token" })
    return
  }
  jwt.verify(token, SETTINGS.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log(err, 'tokenAuthMiddleware err');

      res.sendStatus(401)
      return
    }

    const payload = await jwtService.decodeAccessToken(token)

    req.userId = payload.id
    req.userLogin = payload.login

    console.log(req.userId, req.userLogin, 'tokenAuthMiddleware req.')
    next()
  })
}