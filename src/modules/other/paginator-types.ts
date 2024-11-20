import { BlogViewModel } from "../../db/blog-db"
import { PostViewModel } from "../../db/post-db"
import { UserViewModel } from "../../db/user-db"

export type PaginatorBlogModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogViewModel[]
}

export type PaginatorPostModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostViewModel[]
}

export type PaginatorUsersModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: UserViewModel[]
}