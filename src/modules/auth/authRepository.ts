import { tokensCollection } from "../../db/mongoDb";
import { DeviceViewModel, RefreshTokenModel, RefreshTokenPayloadType } from "../../types/db-types/token-db";

export const authRepository = {
  async addToken(
    token: RefreshTokenModel
  ) {
    const rtoken = {
      lastActiveDate: token.lastActiveDate,
      expirationDate: token.expirationDate,
      deviceId: token.deviceId,
      title: token.title,
      ip: token.ip,
      userId: token.userId
    }
    const res = await tokensCollection.insertOne(rtoken)
    console.log(res.insertedId)

    return res.insertedId
  },
  async updateToken(user: { userId: string, deviceId: string, lastActiveDate: string, expirationDate: string }) {

    const res = await tokensCollection.updateOne({
      userId: user.userId,
      deviceId: user.deviceId
    }, { $set: { lastActiveDate: user.lastActiveDate, expirationDate: user.expirationDate } })//issuedAt

    return res.matchedCount
  },
  async findTokenPayload(
    user: RefreshTokenModel
  ): Promise<RefreshTokenPayloadType | null> {
    console.log(user, 'findTokenPayload');

    const token = await tokensCollection.findOne(
      {
        userId: user.userId,
        lastActiveDate: user.lastActiveDate,
        deviceId: user.deviceId
      },
      { projection: { expirationDate: 0, _id: 0 } }) //issuedAt deviceId userId
    console.log('findTokenPayload', token); //null

    if (!token) {
      return null
    }
    return token
  },

  async findUserTokens(
    user: RefreshTokenModel
  ): Promise<DeviceViewModel[] | null> {
    const tokens = await tokensCollection.find(
      {
        userId: user.userId
      },
      { projection: { _id: 0 } })
      .toArray()//issuedAt deviceId userId
    if (!tokens) {
      return null
    }
    const mappedTokens: DeviceViewModel[] = tokens.map(token => {
      return {
        lastActiveDate: token.lastActiveDate,
        deviceId: token.deviceId,
        ip: token.ip,
        title: token.title
      }
    })
    return mappedTokens
  },

  async findUserSession(
    user: RefreshTokenModel
  ): Promise<DeviceViewModel | null> {
    const token = await tokensCollection.findOne(
      {
        userId: user.userId,
        deviceId: user.deviceId
      },
      { projection: { expirationDate: 0, _id: 0, userId: 0 } })//issuedAt deviceId userId
    if (!token) {
      return null
    }

    return {
      ip: token.ip,
      title: token.title,
      lastActiveDate: token.lastActiveDate,
      deviceId: token.deviceId
    }
  },

  async findDeviceByToken(
    user: RefreshTokenPayloadType
  ): Promise<DeviceViewModel | null> {
    const token = await tokensCollection.findOne(
      {
        userId: user.userId,
        lastActiveDate: user.lastActiveDate,
        deviceId: user.deviceId
      },
      { projection: { expirationDate: 0, _id: 0, userId: 0 } }) //issuedAt deviceId userId
    if (!token) {
      return null
    }
    return token
  },
  async deleteToken(user: DeviceViewModel) {
    const res = await tokensCollection.deleteOne(
      {
        ip: user.ip,
        title: user.title,
        lastActiveDate: user.lastActiveDate,
        deviceId: user.deviceId
      })
    return res.deletedCount === 1
  },
}
