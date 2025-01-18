import { authRepository } from "./authRepository"
import { DeviceViewModel } from "../../types/db-types/token-db"
import { jwtService } from "../other/jwtService"
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"

export const authService = {
  async createTokens(
    user: { id: string, login: string, ip: string, title: string }
  ): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
    const accessToken = await jwtService.generateAccessToken(user.id, user.login)
    const refreshToken = await jwtService.generateRefreshToken(user)
    const tokenInfo = await jwtService.decodeRefreshToken(refreshToken)
    if (!tokenInfo) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'No token info on payload provided',
        data: null,
      }
    }
    const addedToken = await authRepository.addToken({
      ip: user.ip,
      title: user.title,
      lastActiveDate: tokenInfo.lastActiveDate,
      expirationDate: tokenInfo.expirationDate,
      deviceId: tokenInfo.deviceId,
      userId: tokenInfo.userId
    })
    if (!addedToken) {
      return {
        status: ResultStatus.InternalServerError,
        data: null
      }
    }
    console.log('createTokens user', user);

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken }
    }
  },

  //TODO:change creation refreshing token for updating iat

  async refreshTokens(oldRefreshToken: string) {
    const user = await jwtService.decodeRefreshToken(oldRefreshToken)
    console.log(user, 'refreshTokens user')
    const validUserToken = await authRepository.findTokenPayload(user)
    if (!validUserToken) {
      return null
    }

    const refreshToken = await jwtService.generateRefreshToken({ id: user.userId, deviceId: user.deviceId })
    const accessToken = await jwtService.generateAccessToken(user.userId)

    const newPayload = await jwtService.decodeRefreshToken(refreshToken)
    const refreshTokenUpdated = await this.updateRefreshToken({ userId: newPayload.userId, deviceId: newPayload.deviceId, lastActiveDate: newPayload.lastActiveDate, expirationDate: newPayload.expirationDate })
    if (!accessToken || !refreshToken) {
      return null
    }

    if (refreshTokenUpdated.status !== ResultStatus.Success) {
      return null
    }
    return { accessToken: accessToken, refreshToken: refreshToken }
  },

  async deleteRefreshToken(user: DeviceViewModel) {

    const res = await authRepository.deleteToken(user)
    if (!res) {
      return null
    }

    return res
  },

  async findRefreshToken(refreshToken: string) {
    const user = await jwtService.decodeRefreshToken(refreshToken)
    const res = await authRepository.findUserSession(user)
    if (!res) {
      return null
    }

    return res
  },

  async findDeviceInfo(refreshToken: string) {
    const user = await jwtService.decodeRefreshToken(refreshToken)
    const res = await authRepository.findDeviceByToken(user)
    if (!res) {
      return null
    }

    return res
  },

  async updateRefreshToken(user: { userId: string, deviceId: string, lastActiveDate: string, expirationDate: string }): Promise<Result<null>> {
    const res = await authRepository.updateToken(user)
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