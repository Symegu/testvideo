import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../../../settings'
import jwt from 'jsonwebtoken'
// import { JwtService } from '../../other/jwtService';
import { inject, injectable } from 'inversify';

@injectable()
export class TokenAuthMiddleware {

  // constructor(@inject(JwtService) protected jwtService: JwtService){}

  public tokenAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      res.sendStatus(401)
      return
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, SETTINGS.JWT_SECRET, async (err, decoded: any) => {
      if (err) {
        console.log(err, 'tokenAuthMiddleware err');

        res.sendStatus(401)
        return
      }

      //const payload = await this.jwtService.decodeAccessToken(token)

      // req.userId = payload.userId
      // req.userLogin = payload.userLogin
      req.userId = decoded.userId
      req.userLogin = decoded.userLogin
      console.log(req.userId, req.userLogin, 'tokenAuthMiddleware req.')
      next()
    })
  }
}