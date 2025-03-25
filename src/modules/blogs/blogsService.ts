import { BlogViewModel } from "../../types/db-types/blog-db"
import { BlogsRepository } from "./blogsRepository"
import { BlogInputModel } from "../../types/input-output-types/blog-types"
import { PostInputModel } from "../../types/input-output-types/post-types"
import { PostViewModel } from "../../types/db-types/post-db"
import { PostsService } from '../posts/postsService';
import { BlogsQueryRepository } from "./blogsQueryRepository"
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"
import { injectable } from "inversify"

@injectable()
export class BlogsService {

  constructor(
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsService: PostsService
  ){}

  async createBlog(
    blog: BlogInputModel
  ): Promise<Result<BlogViewModel | null>> {
    const createdBlogId: string = await this.blogsRepository.createBlog(blog)
    if (!createdBlogId) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: 'CreatedBlog not found blogsService from blogsQueryRepository',
        data: null
      }
    }
    const createdBlog = await this.blogsQueryRepository.findById(createdBlogId)
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
  }

  async createBlogsPost(
    post: PostInputModel,
    currentBlog: BlogViewModel
  ): Promise<PostViewModel | null> {
    const newPost = await this.postsService.createPost(post, currentBlog)
    if (!newPost) {
      return null
    }

    return newPost
  }

  async changeById(
    blog: BlogInputModel, id: string
  ): Promise<Result<boolean | null>> {
    const res = await this.blogsRepository.changeById(blog, id)

    return {
      status: res.status,
      errorMessage: res.errorMessage,
      data: res.data
    }
  }

  async deleteById(
    id: string
  ): Promise<Result<boolean | null>> {
    const res = await this.blogsRepository.deleteById(id)

    return {
      status: res.status,
      errorMessage: res.errorMessage,
      data: res.data
    }
  }
}