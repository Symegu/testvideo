import { ResultStatus, Result } from "../../types/input-output-types/output-errors-type"
import { UserInputModel } from "../../types/input-output-types/user-types"
import { usersRepository } from './usersRepository'
import { emailRepository } from '../other/emailRepository';
import { usersQueryRepository } from "./usersQueryRepository";

export const usersService = {

  async createUser(user: UserInputModel, adminCreation?: boolean): Promise<Result<{ userId: string } | null>> {
    const newUserId = await usersRepository.createUser(user, adminCreation)
    if (!newUserId) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: 'failed to add user to database',
        extensions: [],
        data: null
      }
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        userId: newUserId
      }
    }
  },

  async deleteUser(id: string) {
    return await usersRepository.deleteUser(id)
  },

  async findConfirmationInfo(id: string) {
    const user = await emailRepository.findConfirmationInfo(id)
    if (!user) {
      return null
    }

    return user
  },

  async findUserById(id: string) {
    const user = await usersQueryRepository.findById(id)
    if (!user) {
      return null
    }

    return user
  }
}