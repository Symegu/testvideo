import { ResultStatus, Result } from "../../types/input-output-types/output-errors-type"
import { UserInputModel } from "../../types/input-output-types/user-types"
import { UsersRepository } from './usersRepository'
import { UsersQueryRepository } from './usersQueryRepository'
import { EmailRepository } from "../other/emailRepository"
import { injectable } from "inversify"

@injectable()
export class UsersService {

  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository, 
    protected emailRepository: EmailRepository,
  ) { }
    
  async createUser(user: UserInputModel, adminCreation?: boolean): Promise<Result<{ userId: string } | null>> {
    const newUserId = await this.usersRepository.createUser(user, adminCreation)
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
  }

  async deleteUser(id: string) {
    return await this.usersRepository.deleteUser(id)
  }

  async findConfirmationInfo(id: string) {
    const user = await this.emailRepository.findConfirmationInfo(id)
    if (!user) {
      return null
    }

    return user
  }

  async findUserById(id: string) {
    const user = await this.usersQueryRepository.findById(id)
    if (!user) {
      return null
    }

    return user
  }

  async getAllUsers(pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchLoginTerm: string | null,
    searchEmailTerm: string | null) {
    const users = await this.usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)

    return users
  }

}