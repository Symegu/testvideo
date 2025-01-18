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
    const sessions = await securityRepository.deleteSessions(user.userId)
    return sessions
  },

  async deleteUserSession(currentRefreshToken: string, deviceId: string) {
    const user = await jwtService.decodeRefreshToken(currentRefreshToken)
    console.log('user deleteUserSession', user);

    // if (user.userId !== userId) {
    //   return null
    // }

    const res = await securityRepository.deleteSession(user.userId, deviceId)
    if (!res) {
      return null
    }

    return res
  }
}