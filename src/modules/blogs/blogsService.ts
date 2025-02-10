import { BlogViewModel } from "../../types/db-types/blog-db"
import { blogsRepository } from "./blogsRepository"
import { BlogInputModel } from "../../types/input-output-types/blog-types"
import { PostInputModel } from "../../types/input-output-types/post-types"
import { PostViewModel } from "../../types/db-types/post-db"
import { postsService } from '../posts/postsService';
import { blogsQueryRepository } from "./blogsQueryRepository"
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"

export const blogsService = {
  async createBlog(
    blog: BlogInputModel
  ): Promise<Result<BlogViewModel | null>> {
    const createdBlogId: string = await blogsRepository.createBlog(blog)
    if (!createdBlogId) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: 'CreatedBlog not found blogsService from blogsQueryRepository',
        data: null
      }
    }
    const createdBlog = await blogsQueryRepository.findById(createdBlogId)
    if (!createdBlog) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'CreatedBlog not found blogsService from blogsQueryRepository',
        data: null
      }
    }
    return {
      status: ResultStatus.Success,
      data: createdBlog
    }
  },

  async createBlogsPost(
    post: PostInputModel,
    currentBlog: BlogViewModel
  ): Promise<PostViewModel | null> {
    const newPost = await postsService.createPost(post, currentBlog)
    if (!newPost) {
      return null
    }

    return newPost
  },

  async changeById(
    blog: BlogInputModel, id: string
  ): Promise<Result<boolean | null>> {
    const res = await blogsRepository.changeById(blog, id)

    return {
      status: res.status,
      errorMessage: res.errorMessage,
      data: res.data
    }
  },

  async deleteById(
    id: string
  ): Promise<Result<boolean | null>> {
    const res = await blogsRepository.deleteById(id)

    return {
      status: res.status,
      errorMessage: res.errorMessage,
      data: res.data
    }
  },
}