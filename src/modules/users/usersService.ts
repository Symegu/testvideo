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
    try {
      const newUserId = await this.usersRepository.createUser(user, adminCreation)
      if (!newUserId) {
        return {
          status: ResultStatus.InternalServerError,
          errorMessage: 'Failed to add user to database',
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
    } catch (error) {
      console.error('Error in createUser service:', error)
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: 'Unexpected error while creating user',
        extensions: [],
        data: null
      }
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.usersRepository.deleteUser(id)
    } catch (error) {
      console.error('Error in deleteUser service:', error)
      throw new Error('Failed to delete user')
    }
  }

  async findConfirmationInfo(id: string) {
    try {
      const user = await this.emailRepository.findConfirmationInfo(id)
      if (!user) {
        return null
      }
      return user
    } catch (error) {
      console.error('Error in findConfirmationInfo:', error)
      return null
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.usersQueryRepository.findById(id)
      if (!user) {
        return null
      }
      return user
    } catch (error) {
      console.error('Error in findUserById:', error)
      return null
    }
  }

  async getAllUsers(pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchLoginTerm: string | null,
    searchEmailTerm: string | null) {
    try {
      const users = await this.usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
      return users
    } catch (error) {
      console.error('Error in getAllUsers service:', error)
      throw new Error('Failed to fetch users')
    }
  }
}



// import { ResultStatus, Result } from "../../types/input-output-types/output-errors-type"
// import { UserInputModel } from "../../types/input-output-types/user-types"
// import { UsersRepository } from './usersRepository'
// import { UsersQueryRepository } from './usersQueryRepository'
// import { EmailRepository } from "../other/emailRepository"
// import { injectable } from "inversify"

// @injectable()
// export class UsersService {

//   constructor(
//     protected usersRepository: UsersRepository,
//     protected usersQueryRepository: UsersQueryRepository, 
//     protected emailRepository: EmailRepository,
//   ) { }
    
//   async createUser(user: UserInputModel, adminCreation?: boolean): Promise<Result<{ userId: string } | null>> {
//     const newUserId = await this.usersRepository.createUser(user, adminCreation)
//     if (!newUserId) {
//       return {
//         status: ResultStatus.InternalServerError,
//         errorMessage: 'failed to add user to database',
//         extensions: [],
//         data: null
//       }
//     }

//     return {
//       status: ResultStatus.Success,
//       extensions: [],
//       data: {
//         userId: newUserId
//       }
//     }
//   }

//   async deleteUser(id: string) {
//     return await this.usersRepository.deleteUser(id)
//   }

//   async findConfirmationInfo(id: string) {
//     const user = await this.emailRepository.findConfirmationInfo(id)
//     if (!user) {
//       return null
//     }

//     return user
//   }

//   async findUserById(id: string) {
//     const user = await this.usersQueryRepository.findById(id)
//     if (!user) {
//       return null
//     }

//     return user
//   }

//   async getAllUsers(pageNumber: number,
//     pageSize: number,
//     sortBy: string,
//     sortDirection: 'asc' | 'desc',
//     searchLoginTerm: string | null,
//     searchEmailTerm: string | null) {
//     const users = await this.usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)

//     return users
//   }

// }