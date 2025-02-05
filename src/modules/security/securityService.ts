import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"
import { jwtService } from "../other/jwtService"
import { securityRepository } from "./securityRepository"

export const securityService = {
  async getUserSessions(currentRefreshToken: string) {
    const user = await jwtService.decodeRefreshToken(currentRefreshToken)
    const sessions = await securityRepository.getSessions(user.userId)
    return sessions
  },

  async deleteAllUserSessions(currentRefreshToken: string) {
    const user = await jwtService.decodeRefreshToken(currentRefreshToken)
    const sessions = await securityRepository.deleteSessions(user.userId, user.deviceId)
    return sessions
  },

  async deleteUserSession(currentRefreshToken: string, deviceId: string): Promise<Result<null>> {
    console.log('currentRefreshToken, deviceId deleteUserSession', currentRefreshToken, deviceId)
    const user = await jwtService.decodeRefreshToken(currentRefreshToken)

    console.log('user deleteUserSession', user)

    const userSessions = await this.getUserSessions(currentRefreshToken)
    const devices = await securityRepository.findDevice(deviceId)
    console.log(devices, 'devices');

    if (!devices.length) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'DeviceID does not found',
        data: null
      }
    }


    if (!userSessions.length || !userSessions.some(session => {
      console.log(user.deviceId, session.deviceId, deviceId);

      // console.log(session.deviceId === deviceId);
      // console.log(session.deviceId !== deviceId);
      return session.deviceId === deviceId

    })) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Refresh token userId does not match',
        extensions: [],
        data: null
      }
    }
    console.log('verified');

    const res = await securityRepository.deleteSession(user.userId, deviceId)
    if (!res) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'User deviceID does not found',
        data: null
      }
    }

    return {
      status: ResultStatus.Success,
      data: null
    }
  }
}