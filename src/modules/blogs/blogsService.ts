import { BlogViewModel } from "../../types/db-types/blog-db"
import { blogsRepository } from "./blogsRepository"
import { BlogInputModel } from "../../types/input-output-types/blog-types"
import { PostInputModel } from "../../types/input-output-types/post-types"
import { PostViewModel } from "../../types/db-types/post-db"
import { postsService } from '../posts/postsService';
import { blogsQueryRepository } from "./blogsQueryRepository"

export const blogsService = {
  async createBlog(
    blog: BlogInputModel
  ): Promise<BlogViewModel | null> {
    const createdBlogId: string = await blogsRepository.createBlog(blog)
    if (!createdBlogId) {
      return null
    }
    const createdBlog = await blogsQueryRepository.findById(createdBlogId)
    if (!createdBlog) {
      return null
    }
    return createdBlog
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
  ): Promise<boolean | null> {
    const currentBlog = await blogsQueryRepository.findById(id)
    if (!currentBlog) {
      return null
    }
    const changedBlog = await blogsRepository.changeById(blog, id, currentBlog)
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