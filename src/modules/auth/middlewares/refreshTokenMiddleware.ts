import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../../../settings'
import jwt from 'jsonwebtoken'
import { JwtService } from '../../other/jwtService'
import { ResultStatus } from '../../../types/input-output-types/output-errors-type'
import { inject, injectable } from 'inversify'

@injectable()
export class RefreshTokenValidator {

  constructor(@inject(JwtService) protected jwtService: JwtService) {}

  public refreshTokenValidator  = (req: Request, res: Response, next: NextFunction): void => {
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken, 'refreshTokenValidator');
  
  
    jwt.verify(refreshToken, SETTINGS.JWT_REFRESH_SECRET, async (err: any, user: any) => {
      if (err) {
        console.log('expired or invalid', err)
        res.sendStatus(401)
        return
      }
  
      const result = await this.jwtService.verifyRefreshTokenVersion(refreshToken)
      if (result.status !== ResultStatus.Success || !result.data) {
        console.log('expired or invalid2', err, result.errorMessage)
        res.sendStatus(401)
        return
      }
      next()
    })
  }
}