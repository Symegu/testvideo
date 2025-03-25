import jwt, { JwtPayload } from 'jsonwebtoken'
import { SETTINGS } from '../../settings'
import { SecurityRepository } from '../security/securityRepository';
import { RefreshTokenModel } from '../../types/db-types/token-db'
import { AuthRepository } from '../auth/authRepository'
import { Result, ResultStatus } from '../../types/input-output-types/output-errors-type'
import { UsersService } from '../users/usersService'
import { injectable } from 'inversify'
import { RefreshTokenModelClass } from '../../db/mongoDb';

/*
  * JWT service: generating(access&refresh tokens), verifying(by iat, by userId), decoding payload for access&refresh tokens
*/
@injectable()
export class JwtService {

  constructor(
    protected securityRepository: SecurityRepository,
    protected authRepository: AuthRepository,
    protected usersService: UsersService
  ){}

  async generateAccessToken(id: string, login?: string) {
    const log = login ? login : await this.usersService.findUserById(id)
    return jwt.sign({
      userId: id,
      userLogin: log
    }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
  }

  async generateRefreshToken(user: { id: string, deviceId?: string }) {
    const dId = user.deviceId
      ? user.deviceId
      : await this.securityRepository.createDeviceUID()
    return jwt.sign({ deviceId: dId, userId: user.id }, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: '20s' })
  }

  async decodeAccessToken(token: string) {
    const payload = jwt.decode(token) as JwtPayload
    const userId = payload.userId
    const userLogin = payload.userLogin
    console.log(payload, 'decodeAccessToken payload')

    return {
      id: userId,
      login: userLogin,
    }
  }

  async decodeRefreshToken(token: string) {

    const payload = jwt.decode(token) as JwtPayload
    const userId = payload.userId
    const iat = payload.iat
    const exp = payload.exp
    const title = payload.title
    const ip = payload.ip
    const deviceId = payload.deviceId
    console.log(payload, 'decodeRefreshToken payload')
    
    const decodedToken = new RefreshTokenModelClass({
      ip: ip,
      title: title,
      lastActiveDate: new Date(iat! * 1000),
      expirationDate: new Date(exp! * 1000),
      deviceId: deviceId,
      userId: userId
    })
    return decodedToken
  }

  async verifyRefreshTokenVersion(token: string): Promise<Result<RefreshTokenModel | null>> {
    const decodedToken: RefreshTokenModel = await this.decodeRefreshToken(token)
    const repoTokens = await this.authRepository.findUserTokens(decodedToken)

    if (!repoTokens || repoTokens.length === 0 || !repoTokens.some(repoToken => {
      return new Date(repoToken.lastActiveDate) <= new Date(decodedToken.lastActiveDate)
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
      data: decodedToken
    }
  }

}