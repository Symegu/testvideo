import { ObjectId } from "mongodb"
import { usersCollection } from '../../db/mongoDb';
import { UserModel, UserViewModel } from '../../types/db-types/user-db';
import { PaginatorUsersModel } from "../../types/paginator-types";

export const usersQueryRepository = {
  async getAllUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
  ): Promise<PaginatorUsersModel> {
    let filter: any = {$or: []}

    if(searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
    }

    if(searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
    }

    if(!searchLoginTerm && !searchEmailTerm) {
      filter = {}
    }
    console.log(filter, 'filter');
    const dbUsers= await usersCollection
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()
    
    const mappedUsers: UserViewModel[] = dbUsers.map(user => {
      return this.mapUserToOutput(user)
    })
    const usersCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm)
    console.log(usersCount, 'usersCount');
    const users = {
      pagesCount: Math.ceil(usersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: mappedUsers
    }
    console.log(users, 'users');
    return users
  },

  async getUsersCount(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
  ): Promise<number> {
    let filter: any = {$or: []}

    if(searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
    }

    if(searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
    }

    if(!searchLoginTerm && !searchEmailTerm) {
      filter = {}
    }
    console.log(filter, 'filter');
    const count = await usersCollection.countDocuments(filter)
    console.log(count, 'count');
    return count
  },

  async findById(
    id: string
  ): Promise<UserViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id);
    const user = await usersCollection.findOne(
        { _id }
    )
    console.log('findById user', user);
    
    if (!user) {
      return null
    }
    
    return this.mapUserToOutput(user)
  },

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserModel | null> {
    const user = await usersCollection.findOne({
      $or: [
        {login: {$regex: loginOrEmail}},
        {email: {$regex: loginOrEmail}}
      ]
    })
    if (!user) {
      return null
    }
    return user
  },

  mapUserToOutput(user: UserModel) {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
    } as UserViewModel
  }
}