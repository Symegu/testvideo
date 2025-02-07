import { Request, Response } from 'express'
import { usersService } from './usersService'
import { UserInputModel } from '../../types/input-output-types/user-types'
import { UserViewModel } from '../../types/db-types/user-db'
import { usersQueryRepository } from './usersQueryRepository'
import { paginationQueries } from '../other/paginationQueries'
import { PaginatorUsersModel } from '../../types/paginator-types';
import { HttpStatuses, ResultStatus } from '../../types/input-output-types/output-errors-type'

export const usersController = {
  async getUsers(req: Request, res: Response<PaginatorUsersModel>) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = paginationQueries(req)
    const users = await usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)

    res.status(HttpStatuses.Created).json(users)
  },

  async createUser(req: Request<UserInputModel>, res: Response<UserViewModel>) {
    const result = await usersService.createUser(req.body, true)
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatuses.ServerError)
      return
    }

    const newUser = await usersQueryRepository.findById(result.data!.userId)
    if (!newUser) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.status(HttpStatuses.Created).json(newUser)
  },

  async deleteUser(req: Request<{ id: string }>, res: Response) {
    const deletedUser = await usersService.deleteUser(req.params.id)

    if (!deletedUser) {
      res.sendStatus(HttpStatuses.NotFound)
      return
    }

    res.sendStatus(HttpStatuses.NoContent)
  }
}