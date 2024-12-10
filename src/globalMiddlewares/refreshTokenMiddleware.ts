import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../settings'
import jwt, { JwtPayload } from 'jsonwebtoken'
interface JwtUserPayload extends JwtPayload {
  userId: string,
  userLogin: string
}
export const refreshTokenValidator = (req: Request, res: Response, next: NextFunction): void => {
  const refreshToken = req.cookies.refreshToken
  console.log(refreshToken, 'refreshTokenValidator');

  // const token = refreshToken.split(' ')[1]
  jwt.verify(refreshToken, SETTINGS.JWT_REFRESH_SECRET, (err: any, user: any) => {
    if (err) { 
      console.log('expired or invalid', err)
      res.sendStatus(401)
      return
    }

    const payload = jwt.decode(refreshToken) as JwtUserPayload
    req.userId = payload.userId
    req.userLogin = payload.userLogin
    console.log( req.userId, req.userLogin, 'getInfoFromPayload  req.userLogin')
    next()
  })
}