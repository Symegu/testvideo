import { tokensCollection } from "../../db/mongoDb";

export const tokenRepository = {
  async addToken(token:string) {
    const res = await tokensCollection.insertOne({ refreshToken: token })
    console.log(res.insertedId);
    
    return res.insertedId
  },
  async updateToken(oldToken: string, newToken: string) {
    const res = await tokensCollection.updateOne({ refreshToken: oldToken }, {$set: {refreshToken: newToken}})

    if(res.matchedCount !== 1) {
      return null
    }
    return newToken
  },

  async findToken(token: string) {
    const validToken = await tokensCollection.findOne({ refreshToken: token }) 
    if(!validToken) {
      return null
    }
    return validToken
  },

  async deleteToken(token: string) {
    const res = await tokensCollection.deleteOne({ refreshToken: token })
    return res.deletedCount === 1
  },

  async findTokensByUserId(userId: string) {
    const tokens = await tokensCollection.findOne({ userId })
    return tokens
  }
}
