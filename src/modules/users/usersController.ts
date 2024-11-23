import { Request, Response } from 'express'
import { usersService } from './usersService'
import { UserInputModel } from '../../types/input-output-types/user-types'
import { UserViewModel } from '../../types/db-types/user-db'
import { usersQueryRepository } from './usersQueryRepository'
import { paginationQueries } from '../other/paginationQueries'
import { PaginatorUsersModel } from '../../types/paginator-types';

export const usersController = {
  async getUsers(req: Request, res: Response<PaginatorUsersModel>) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = paginationQueries(req)    
    const users = await usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
    
    res.status(200).json(users)
  }, 
  
  async createUser(req: Request<UserInputModel>, res: Response<UserViewModel>) {
    const newUserId = await usersService.createUser(req.body)
    if(!newUserId) {
      res.sendStatus(400)
      return
    }
    console.log('usersService newUserId', newUserId)

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