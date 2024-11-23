import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../settings'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface JwtUserPayload extends JwtPayload {
  userId: string,
  userLogin: string
}

export const tokenAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: "invalid token" })
    return
  }

  jwt.verify(token, SETTINGS.JWT_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403)
      return
    }
    console.log(user, 'tokenAuthMiddleware')
    const payload = user as JwtUserPayload
    req.userId = payload.userId
    req.userLogin = payload.userLogin
    next()
  })
}