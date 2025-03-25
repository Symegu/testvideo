import { injectable } from "inversify"
import { DeviceViewModel, RefreshTokenModel, RefreshTokenPayloadType } from "../../types/db-types/token-db"
import { RefreshTokenModelClass } from "../../db/mongoDb"

@injectable()
export class AuthRepository {
  async addToken(
    token: RefreshTokenModel
  ) {
    const rtoken = new RefreshTokenModelClass({
      lastActiveDate: token.lastActiveDate,
      expirationDate: token.expirationDate,
      deviceId: token.deviceId,
      title: token.title,
      ip: token.ip,
      userId: token.userId
    })
    const res = await rtoken.save()

    return res.id.toString()
  }

  async updateToken(
    user: { 
      userId: string,
      deviceId: string,
      lastActiveDate: Date,
      expirationDate: Date 
    }) {

    const res = await RefreshTokenModelClass.updateOne({
      userId: user.userId,
      deviceId: user.deviceId
    }, { $set: { lastActiveDate: user.lastActiveDate, expirationDate: user.expirationDate } }) //issuedAt

    return res.matchedCount
  }

  async findTokenPayload(
    user: RefreshTokenModel
  ): Promise<RefreshTokenPayloadType | null> {

    const token = await RefreshTokenModelClass.findOne(
      {
        userId: user.userId,
        lastActiveDate: user.lastActiveDate,
        deviceId: user.deviceId
      }).select({ _id: 0 }) //issuedAt deviceId userId
    if (!token) {
      return null
    }
    return {
      userId: token.userId,
      lastActiveDate: token.lastActiveDate.toISOString(),  // ISO string format
      deviceId: token.deviceId
    }
  }

  async findUserTokens(
    user: RefreshTokenModel
  ): Promise<DeviceViewModel[] | null> {
    const tokens = await RefreshTokenModelClass.find(
      {
        userId: user.userId
      },
      { projection: { _id: 0 } })
    if (!tokens) {
      return null
    }
    const mappedTokens: DeviceViewModel[] = tokens.map(token => {
      return {
        lastActiveDate: token.lastActiveDate.toISOString(),
        deviceId: token.deviceId,
        ip: token.ip,
        title: token.title
      }
    })
    return mappedTokens
  }

  async findUserSession(
    user: RefreshTokenModel
  ): Promise<DeviceViewModel | null> {
    const token = await RefreshTokenModelClass.findOne(
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
      lastActiveDate: token.lastActiveDate.toISOString(),
      deviceId: token.deviceId
    }
  }

  async findDeviceByToken(
    user: RefreshTokenPayloadType
  ): Promise<DeviceViewModel | null> {
    const token = await RefreshTokenModelClass.findOne(
      {
        userId: user.userId,
        lastActiveDate: user.lastActiveDate,
        deviceId: user.deviceId
      },
      { projection: { expirationDate: 0, _id: 0, userId: 0 } }) //issuedAt deviceId userId
    if (!token) {
      return null
    }
    return {
      ip: token.ip,
      title: token.title,
      lastActiveDate: token.lastActiveDate.toISOString(),  // ISO string format
      deviceId: token.deviceId
    }
  }

  async deleteToken(user: DeviceViewModel) {
    const res = await RefreshTokenModelClass.deleteOne(
      {
        ip: user.ip,
        title: user.title,
        lastActiveDate: user.lastActiveDate,
        deviceId: user.deviceId
      })
    return res.deletedCount === 1
  }
}
