import { PostViewModel } from "../../types/db-types/post-db"
import { PostsRepository } from './postsRepository';
import { PostInputModel } from "../../types/input-output-types/post-types"
import { BlogViewModel } from "../../types/db-types/blog-db";
import { BlogsQueryRepository } from "../blogs/blogsQueryRepository";
import { PostsQueryRepository } from "./postsQueryRepository";
import { inject, injectable } from "inversify";

@injectable()
export class PostsService {

  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
  ){}

  async createPost(
    post: PostInputModel,
    providedBlog?: BlogViewModel
  ): Promise<PostViewModel | null> {
    const blog: BlogViewModel | null = providedBlog ?? await this.blogsQueryRepository.findById(post.blogId)
    if (!blog) {
      return null
    }

    const newPostId = await this.postsRepository.createPost(post, blog)
    const newPost = await this.postsQueryRepository.findById(newPostId)

    return newPost || null
  }

  async changeById(
    post: PostInputModel, id: string
  ): Promise<boolean | null> {
    const currentBlog: BlogViewModel | null =
      await this.blogsQueryRepository.findById(post.blogId)
    const currentPost: PostViewModel | null =
      await this.postsQueryRepository.findById(id)
    if (!currentBlog || !currentPost) {
      return null
    }
    const changedPost = await this.postsRepository.changeById(post, id, currentBlog, currentPost)
    return changedPost
  }
  
  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await this.postsRepository.deleteById(id)
    return res
  }
}