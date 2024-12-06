import { tokensCollection } from "../../db/mongoDb";

export const tokenRepository = {

  async updateToken(oldToken: string, newToken: string) {
    const res = await tokensCollection.updateOne({ refreshToken: oldToken }, {$set: {refreshToken: newToken}})

    if(res.matchedCount !== 1) {
      return null
    }
    return newToken
  },

  async deleteToken(token: string) {
    await tokensCollection.deleteOne({ refreshToken: token })
  },

  async findTokensByUserId(userId: string) {
    const tokens = await tokensCollection.findOne({ userId })
    return tokens
  }
}
