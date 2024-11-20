import { Request, Response } from 'express'
import { usersService } from './usersService'
import { UserInputModel } from '../../input-output-types/user-types'
import { UserViewModel } from '../../db/user-db'
import { usersQueryRepository } from './usersQueryRepository'
import { paginationQueries } from '../other/paginationQueries'
import { PaginatorUsersModel } from '../other/paginator-types';

export const usersController = {
  async getUsers(req: Request, res: Response<PaginatorUsersModel>) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = paginationQueries(req)    
    const mappedUsers = await usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
    const usersCount = await usersQueryRepository.getUsersCount(searchLoginTerm, searchEmailTerm)
    console.log(usersCount, 'usersCount');
    const users = {
      pagesCount: Math.ceil(usersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: mappedUsers
    }
    console.log(users, 'users');
    res.status(200).json(users)
  }, 
  
  async createUser(req: Request<UserInputModel>, res: Response<UserViewModel>) {
    const newUserId = await usersService.createUser(req.body)
    if(!newUserId) {
      res.sendStatus(400)
      return
    }

    const newUser = await usersQueryRepository.findById(newUserId)
    if(!newUser) {
      res.sendStatus(404)
      return
    }

    res.status(201).json(newUser)
  },

  async deleteUser(req: Request<{id: string}>, res: Response) {
    const deletedUser = await usersService.deleteUser(req.params.id)

    if(!deletedUser) {
      res.sendStatus(404)
      return
    }

    res.sendStatus(204)
  }
}