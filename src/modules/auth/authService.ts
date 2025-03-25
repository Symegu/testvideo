import { AuthRepository } from "./authRepository"
import { DeviceViewModel } from "../../types/db-types/token-db"
import { JwtService } from "../other/jwtService"
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"
import { injectable } from "inversify"
import { RefreshTokenModelClass } from "../../db/mongoDb"

@injectable()
export class AuthService {

  constructor(
    protected authRepository: AuthRepository,
    protected jwtService: JwtService
  ){}
  
  async createTokens(
    user: { id: string, login: string, ip: string, title: string }
  ): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
    const accessToken = await this.jwtService.generateAccessToken(user.id, user.login)
    const refreshToken = await this.jwtService.generateRefreshToken(user)
    const tokenInfo = await this.jwtService.decodeRefreshToken(refreshToken)
    if (!tokenInfo) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'No token info on payload provided',
        data: null,
      }
    }
    const token = new RefreshTokenModelClass({
      ip: user.ip,
      title: user.title,
      lastActiveDate: tokenInfo.lastActiveDate,
      expirationDate: tokenInfo.expirationDate,
      deviceId: tokenInfo.deviceId,
      userId: tokenInfo.userId
    })

    const addedToken = await this.authRepository.addToken(token)

    if (!addedToken) {
      return {
        status: ResultStatus.InternalServerError,
        data: null
      }
    }
    console.log('createTokens user', user)

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken }
    }
  }

  async refreshTokens(oldRefreshToken: string) {
    const user = await this.jwtService.decodeRefreshToken(oldRefreshToken)
    console.log(user, 'refreshTokens user')
    const validUserToken = await this.authRepository.findTokenPayload(user)
    if (!validUserToken) {
      return null
    }

    const valid = await this.jwtService.verifyRefreshTokenVersion(oldRefreshToken)
    if (!valid) {
      return null
    }

    const refreshToken = await this.jwtService.generateRefreshToken({ id: user.userId, deviceId: user.deviceId })
    const accessToken = await this.jwtService.generateAccessToken(user.userId)

    const newPayload = await this.jwtService.decodeRefreshToken(refreshToken)
    const refreshTokenUpdated = await this.updateRefreshToken({ userId: newPayload.userId, deviceId: newPayload.deviceId, lastActiveDate: newPayload.lastActiveDate, expirationDate: newPayload.expirationDate })
    if (!accessToken || !refreshToken) {
      return null
    }

    if (refreshTokenUpdated.status !== ResultStatus.Success) {
      return null
    }
    return { accessToken: accessToken, refreshToken: refreshToken }
  }

  async deleteRefreshToken(user: DeviceViewModel) {

    const res = await this.authRepository.deleteToken(user)
    if (!res) {
      return null
    }

    return res
  }

  async findRefreshToken(refreshToken: string) {
    const user = await this.jwtService.decodeRefreshToken(refreshToken)
    const res = await this.authRepository.findUserSession(user)
    if (!res) {
      return null
    }

    return res
  }

  async findDeviceInfo(refreshToken: string) {
    const user = await this.jwtService.decodeRefreshToken(refreshToken)
    const res = await this.authRepository.findDeviceByToken({userId: user.userId, lastActiveDate: user.lastActiveDate.toISOString(), deviceId: user.deviceId})
    if (!res) {
      return null
    }

    return res
  }

  async updateRefreshToken(user: { userId: string, deviceId: string, lastActiveDate: Date, expirationDate: Date }): Promise<Result<null>> {
    const res = await this.authRepository.updateToken(user)
    if (!res) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: 'Cannot update token',
        data: null
      }
    }
    return {
      status: ResultStatus.Success,
      data: null
    }
  }
}