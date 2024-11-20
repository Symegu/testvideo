import { ObjectId } from "mongodb"
import { usersCollection } from '../../db/mongoDb';
import { UserModel, UserViewModel } from '../../db/user-db';
import { PaginatorUsersModel } from "../other/paginator-types";

export const usersQueryRepository = {
  async getAllUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
  ): Promise<PaginatorUsersModel> {
    const filter: any = {}
    console.log(filter, 'filter');
    
    if(searchLoginTerm) {
      filter.login = {$regex: searchLoginTerm, $options: 'i'}
    }

    if(searchEmailTerm) {
      filter.email = {$regex: searchEmailTerm, $options: 'i'}
    }
    
    const dbUsers= await usersCollection
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()

    console.log(dbUsers,'dbUsers');
    
    const mappedUsers: UserViewModel[] = dbUsers.map(user => {
      return this.mapUserToOutput(user)
    })
    console.log(mappedUsers, 'mappedUsers');
    
    const usersCount = await this.getUsersCount(searchEmailTerm, searchLoginTerm)
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
    const filter: any = {}

    if(searchLoginTerm) {
      filter.login = {$regex: searchLoginTerm, $options: 'i'}
    }

    if(searchEmailTerm) {
      filter.email = {$regex: searchEmailTerm, $options: 'i'}
    }
    return await usersCollection.countDocuments(filter)
  },

  async findById(
    id: string
  ): Promise<UserViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id);
    const user = await usersCollection.findOne(
        { _id },
        { projection: { _id: 0 } }
    );
    if (!user) {
      return null;
    }
    
    return {
      id: _id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
    };
  },

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserModel | null> {
    const user = await usersCollection.findOne({
      $or: [
        {login: {$regex: loginOrEmail}},
        {email: {$regex: loginOrEmail}}
      ]
    })

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