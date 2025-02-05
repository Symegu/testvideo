import { tokensCollection } from "../../db/mongoDb"
import { randomUUID } from "crypto"
import { RefreshTokenModel } from "../../types/db-types/token-db"

export const securityRepository = {

  async createDeviceUID() {
    const deviceId = randomUUID()
    return deviceId.toString()
  },

  async getSessions(
    userId: string
  ): Promise<RefreshTokenModel[]> {
    const tokens = await tokensCollection.find(
      { userId: userId },
      { projection: { _id: 0, userId: 0, expirationDate: 0 } }
    ).toArray()
    console.log(tokens, 'tokens');

    return tokens
  },

  async findDevice(
    deviceId: string
  ) {
    const tokens = await tokensCollection.find(
      { deviceId: deviceId },
      { projection: { _id: 0, expirationDate: 0 } }
    ).toArray()

    return tokens
  },

  async deleteSessions(
    userId: string,
    deviceId: string
  ) {
    const res = await tokensCollection.deleteMany(
      {
        userId: userId,
        deviceId: { $ne: deviceId }
      }
    )
    return res.deletedCount
  },

  async deleteSession(
    userId: string,
    deviceId: string
  ) {
    const res = await tokensCollection.deleteOne(
      { userId: userId, deviceId: deviceId }
    )
    return res.deletedCount
  }
}