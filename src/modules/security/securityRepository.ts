import { randomUUID } from "crypto"
import { RefreshTokenModel } from "../../types/db-types/token-db"
import { injectable } from "inversify"
import { RefreshTokenModelClass } from "../../db/mongoDb"

@injectable()
export class SecurityRepository {

  async createDeviceUID() {
    const deviceId = randomUUID()
    return deviceId.toString()
  }

  async getSessions(
    userId: string
  ): Promise<RefreshTokenModel[]> {
    const tokens = await RefreshTokenModelClass.find(
      { userId: userId },
      { projection: { _id: 0, userId: 0, expirationDate: 0 } }
    )
    console.log(tokens, 'tokens');

    return tokens
  }

  async findDevice(
    deviceId: string
  ) {
    const tokens = await RefreshTokenModelClass.find(
      { deviceId: deviceId },
      { projection: { _id: 0, expirationDate: 0 } }
    )

    return tokens
  }

  async deleteSessions(
    userId: string,
    deviceId: string
  ) {
    const res = await RefreshTokenModelClass.deleteMany(
      {
        userId: userId,
        deviceId: { $ne: deviceId }
      }
    )
    return res.deletedCount
  }

  async deleteSession(
    userId: string,
    deviceId: string
  ) {
    const res = await RefreshTokenModelClass.deleteOne(
      { userId: userId, deviceId: deviceId }
    )
    return res.deletedCount
  }
}