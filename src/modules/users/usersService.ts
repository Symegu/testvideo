import { SETTINGS } from "../../settings"
import { UserViewModel } from "../../types/db-types/user-db"
import { UserInputModel } from "../../types/input-output-types/user-types"
import { usersRepository } from './usersRepository'
import jwt from 'jsonwebtoken'

export const usersService = {

  async createUser(user: UserInputModel): Promise<string | null> {
    const newUserId = await usersRepository.createUser(user)
    if (!newUserId) {
      return null
    }
    console.log('usersService newUserId', newUserId)
    
    return newUserId
  },

  async deleteUser(id: string) {
    return await usersRepository.deleteUser(id)
  },

  async generateToken(user: UserViewModel) {
    console.log(user, user.id, user.login, 'generateToken user');
    
    return jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET)
  },

}