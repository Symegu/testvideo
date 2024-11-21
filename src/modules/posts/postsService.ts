import { PostViewModel } from "../../db/post-db"
import { postsRepository } from './postsRepository';
import { PostInputModel } from "../../input-output-types/post-types"
import { BlogViewModel } from "../../db/blog-db";
import { blogsQueryRepository } from "../blogs/blogsQueryRepository";
import { postsQueryRepository } from "./postsQueryRepository";

export const postsService = {
  async createPost(
    post: PostInputModel,
    providedBlog?: BlogViewModel
  ): Promise<PostViewModel | null> {
    const blog: BlogViewModel | null = providedBlog ?? await blogsQueryRepository.findById(post.blogId)
    if (!blog) {
      return null
    }

    const newPostId = await postsRepository.createPost(post, blog)
    const newPost = await postsQueryRepository.findById(newPostId)

    return newPost || null
  },
  async changeById(
    post: PostInputModel, id: string
  ): Promise<boolean | null> {
    const currentBlog: BlogViewModel | null =
      await blogsQueryRepository.findById(post.blogId)
    const currentPost: PostViewModel | null =
      await postsQueryRepository.findById(id)
    if (!currentBlog || !currentPost) {
      return null
    }
    const changedPost = await postsRepository.changeById(post, id, currentBlog, currentPost)
    return changedPost
  },
  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await postsRepository.deleteById(id)
    return res
  },
}