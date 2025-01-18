import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../../../settings'
import jwt from 'jsonwebtoken'
import { jwtService } from '../../other/jwtService'
import { ResultStatus } from '../../../types/input-output-types/output-errors-type'

export const refreshTokenValidator = (req: Request, res: Response, next: NextFunction): void => {
  const refreshToken = req.cookies.refreshToken
  console.log(refreshToken, 'refreshTokenValidator');

  // const token = refreshToken.split(' ')[1]

  //?Насколько безопасно доставать JWT_REFRESH_SECRET на презентационный слой?

  jwt.verify(refreshToken, SETTINGS.JWT_REFRESH_SECRET, async (err: any, user: any) => {
    if (err) {
      console.log('expired or invalid', err)
      res.sendStatus(401)
      return
    }

    //TODO:add checking token version in repository by iat in jwtService
    const token = await jwtService.verifyRefreshTokenVersion(refreshToken)
    if (!token || token.status !== ResultStatus.Success) {
      console.log('expired or invalid2', err, token.errorMessage)
      res.sendStatus(401)
      return
    }
    next()
  })
}