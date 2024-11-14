import { BlogViewModel } from "../../db/blog-db"
import { PostViewModel } from "../../db/post-db"

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