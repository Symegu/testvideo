import { Request } from 'express'

export class PaginationQueries {
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: 'asc' | 'desc'
  searchNameTerm: string | null
  searchLoginTerm: string | null
  searchEmailTerm: string | null

  constructor(req: Request) {
    this.pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
    this.pageSize = req.query.pageSize ? +req.query.pageSize : 10
    this.sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    this.sortDirection = req.query.sortDirection && req.query.sortDirection.toString() === 'asc' ? 'asc' : 'desc'
    this.searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null
    this.searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null
    this.searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null
  }

  getPaginationParams() {
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      searchNameTerm: this.searchNameTerm,
      searchLoginTerm: this.searchLoginTerm,
      searchEmailTerm: this.searchEmailTerm
    }
  }
}

