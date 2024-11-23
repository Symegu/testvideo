import { BlogViewModel } from "./db-types/blog-db"
import { CommentViewModel } from "./db-types/comment-db"
import { PostViewModel } from "./db-types/post-db"
import { UserViewModel } from "./db-types/user-db"

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

export type PaginatorCommentsModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: CommentViewModel[]
}