import { ObjectId } from "mongodb"
import { BlogViewModel } from "../../db/blog-db"
import { PaginatorBlogModel } from "../other/paginator-types"
import { blogsRepository } from "./blogsRepository"
import { BlogInputModel } from "../../input-output-types/blog-types"

export const blogsService = {
  async getBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null
  ): Promise<PaginatorBlogModel> {
    const blogs = await blogsRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    const blogsCount = await blogsRepository.getBlogsCount(searchNameTerm)
    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: blogsCount,
      items: blogs
    }
  },
  async findById(
    id: string
  ): Promise<BlogViewModel | null> {
    return await blogsRepository.findById(id)
  },
  async findByUUID(
    _id: ObjectId
  ): Promise<BlogViewModel | null> {
    return await blogsRepository.findByUUID(_id)
  },
  async createBlog(
    blog: BlogInputModel
  ): Promise<BlogViewModel | null> {
    const createdBlogUUID: ObjectId = await blogsRepository.createBlog(blog)
    if (!createdBlogUUID) {
      return null
    }
    const createdBlog = await blogsRepository.findByUUID(createdBlogUUID)
    if (!createdBlog) {
      return null
    }
    return createdBlog
  },
  async changeById(
    blog: BlogInputModel, id: string
  ): Promise<boolean | null> {
    const currentBlog = await blogsRepository.findById(id)
    if (!currentBlog) {
      return null
    }
    const changedBlog = await blogsRepository.changeById(blog, id)
    if (!changedBlog) {
      return null
    }
    return changedBlog
  },
  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await blogsRepository.deleteById(id)
    return res
  },
}