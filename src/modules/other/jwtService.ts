import jwt, { JwtPayload } from 'jsonwebtoken'
import { SETTINGS } from '../../settings'
import { securityRepository } from '../security/securityRepository'
import { RefreshTokenModel } from '../../types/db-types/token-db'
import { authRepository } from '../auth/authRepository'
import { Result, ResultStatus } from '../../types/input-output-types/output-errors-type'
import { usersService } from '../users/usersService'

/*
  * JWT service: generating(access&refresh tokens), verifying(by iat, by userId), decoding payload for access&refresh tokens
*/
export const jwtService = {

  async generateAccessToken(id: string, login?: string) {
    const log = login ? login : await usersService.findUserById(id)
    return jwt.sign({
      userId: id,
      userLogin: log
    }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
  },

  async generateRefreshToken(user: { id: string, deviceId?: string }) {
    const dId = user.deviceId
      ? user.deviceId
      : await securityRepository.createDeviceUID()
    return jwt.sign({ deviceId: dId, userId: user.id }, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: '20s' })
  },

  async decodeAccessToken(token: string) {
    const payload = jwt.decode(token) as JwtPayload
    const userId = payload.userId
    const userLogin = payload.userLogin
    console.log(payload, 'decodeAccessToken payload')

    return {
      id: userId,
      login: userLogin,
    }
  },

  async decodeRefreshToken(token: string): Promise<RefreshTokenModel> {

    const payload = jwt.decode(token) as JwtPayload
    const userId = payload.userId
    const iat = payload.iat
    const exp = payload.exp
    const title = payload.title
    const ip = payload.ip
    const deviceId = payload.deviceId
    console.log(payload, 'decodeRefreshToken payload')

    return {
      ip: ip,
      title: title,
      lastActiveDate: new Date(iat! * 1000).toISOString(),
      expirationDate: new Date(exp! * 1000).toISOString(),
      deviceId: deviceId,
      userId: userId
    }
  },

  //TODO: add checking token version in repository by iat
  async verifyRefreshTokenVersion(token: string): Promise<Result<RefreshTokenModel | null>> {
    const payload = await this.decodeRefreshToken(token)
    const repoTokens = await authRepository.findUserTokens(payload)

    if (!repoTokens || repoTokens.length === 0 || !repoTokens.some(repoToken => {
      console.log(new Date(repoToken.lastActiveDate), new Date(payload.lastActiveDate))

      return new Date(repoToken.lastActiveDate) <= new Date(payload.lastActiveDate)
    })) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Refresh token version is not valid (future date)',
        extensions: [],
        data: null
      }
    }

    return {
      status: ResultStatus.Success,
      data: { ...payload }
    }
  }

}