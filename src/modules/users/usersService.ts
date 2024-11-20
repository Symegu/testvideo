import { UserInputModel } from "../../input-output-types/user-types"
import { usersRepository } from './usersRepository';

export const usersService = {

  async createUser(user: UserInputModel) {
    const newUserId = await usersRepository.createUser(user)
    if(!newUserId) {
      return null
    }
    return newUserId
  }, 

  async deleteUser(id:string) {
    return await usersRepository.deleteUser(id)
  },
  
}