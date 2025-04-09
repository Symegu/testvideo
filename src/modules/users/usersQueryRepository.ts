import { ObjectId } from "mongodb"
import { UserModel, UserViewModel } from '../../types/db-types/user-db';
import { PaginatorUsersModel } from "../../types/paginator-types";
import { UserModelClass } from "../../db/mongoDb";
import { injectable } from "inversify";

@injectable()
export class UsersQueryRepository {

  async getAllUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
  ): Promise<PaginatorUsersModel> {
    try {
      let filter: any = { $or: [] }

      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
      }

      if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
      }

      if (!searchLoginTerm && !searchEmailTerm) {
        filter = {}
      }

      const dbUsers = await UserModelClass
        .find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })

      const mappedUsers: UserViewModel[] = dbUsers.map(user => this.mapUserToOutput(user))
      const usersCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm)

      return {
        pagesCount: Math.ceil(usersCount / pageSize),
        page: pageNumber,
        pageSize,
        totalCount: usersCount,
        items: mappedUsers
      }
    } catch (error) {
      console.error('Error in getAllUsers query repo:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async getUsersCount(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
  ): Promise<number> {
    try {
      let filter: any = { $or: [] }

      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
      }

      if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
      }

      if (!searchLoginTerm && !searchEmailTerm) {
        filter = {}
      }

      return await UserModelClass.countDocuments(filter)
    } catch (error) {
      console.error('Error in getUsersCount query repo:', error)
      throw new Error('Failed to count users')
    }
  }

  async findById(
    id: string
  ): Promise<UserViewModel | null> {
    try {
      // if (!ObjectId.isValid(id)) {
      //   return null
      // }

      // const _id = new ObjectId(id)
      const user = await UserModelClass.findOne({ _id: id })

      if (!user) {
        return null
      }

      return this.mapUserToOutput(user)
    } catch (error) {
      console.error('Error in findById query repo:', error)
      return null
    }
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserModel | null> {
    try {
      return await UserModelClass.findOne({
        $or: [
          { login: { $regex: loginOrEmail } },
          { email: { $regex: loginOrEmail } }
        ]
      })
    } catch (error) {
      console.error('Error in findUserByLoginOrEmail query repo:', error)
      return null
    }
  }

  mapUserToOutput(user: UserModel) {
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    } as UserViewModel
  }
}



// import { ObjectId } from "mongodb"
// import { UserModel, UserViewModel } from '../../types/db-types/user-db';
// import { PaginatorUsersModel } from "../../types/paginator-types";
// import { UserModelClass } from "../../db/mongoDb";
// import { injectable } from "inversify";

// @injectable()
// export class UsersQueryRepository {
  
//   async getAllUsers(
//     pageNumber: number,
//     pageSize: number,
//     sortBy: string,
//     sortDirection: 'asc' | 'desc',
//     searchLoginTerm: string | null,
//     searchEmailTerm: string | null
//   ): Promise<PaginatorUsersModel> {
//     let filter: any = {$or: []}

//     if(searchLoginTerm) {
//       filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
//     }

//     if(searchEmailTerm) {
//       filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
//     }

//     if(!searchLoginTerm && !searchEmailTerm) {
//       filter = {}
//     }
//     console.log(filter, 'filter');
//     const dbUsers= await UserModelClass
//       .find(filter)
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize)
//       .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
    
//     const mappedUsers: UserViewModel[] = dbUsers.map(user => {
//       return this.mapUserToOutput(user)
//     })
//     const usersCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm)

//     const users = {
//       pagesCount: Math.ceil(usersCount / pageSize),
//       page: pageNumber,
//       pageSize,
//       totalCount: usersCount,
//       items: mappedUsers
//     }
    
//     return users
//   }

//   async getUsersCount(
//     searchLoginTerm: string | null,
//     searchEmailTerm: string | null
//   ): Promise<number> {
//     let filter: any = {$or: []}

//     if(searchLoginTerm) {
//       filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
//     }

//     if(searchEmailTerm) {
//       filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
//     }

//     if(!searchLoginTerm && !searchEmailTerm) {
//       filter = {}
//     }
//     console.log(filter, 'filter');
//     const count = await UserModelClass.countDocuments(filter)
//     console.log(count, 'count');
//     return count
//   }

//   async findById(
//     id: string
//   ): Promise<UserViewModel | null> {
//     if (!ObjectId.isValid(id)) {
//       return null;
//     }

//     const _id = new ObjectId(id);
//     const user = await UserModelClass.findOne(
//         { _id }
//     )
//     console.log('findById user', user);
    
//     if (!user) {
//       return null
//     }
    
//     return this.mapUserToOutput(user)
//   }

//   async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserModel | null> {
//     const user = await UserModelClass.findOne({
//       $or: [
//         {login: {$regex: loginOrEmail}},
//         {email: {$regex: loginOrEmail}}
//       ]
//     })
//     if (!user) {
//       return null
//     }
//     return user
//   }
  
//   mapUserToOutput(user: UserModel) {
//     return {
//       id: user.id.toString(),
//       login: user.login,
//       email: user.email,
//       createdAt: user.createdAt.toString()
//     } as UserViewModel
//   }
// }