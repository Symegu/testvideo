import { PostViewModel } from "../../db/post-db"
import { postsRepository } from './postsRepository';
import { PostInputModel } from "../../input-output-types/post-types"
import { BlogViewModel } from "../../db/blog-db";
import { blogsService } from "../blogs/blogsService";
import { PaginatorPostModel } from "../other/paginator-types";

export const postsService = {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null,
    blogId?: string | null,
  ): Promise<PaginatorPostModel> {
    const posts = await postsRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, blogId)
    const postsCount = await postsRepository.getPostsCount(searchNameTerm, blogId)
    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: postsCount,
      items: posts
    }
  },
  async createPost(
    post: PostInputModel,
    providedBlog?: BlogViewModel
  ): Promise<PostViewModel | null> {
    const blog: BlogViewModel | null = providedBlog ?? await blogsService.findById(post.blogId)
    if (!blog) {
      return null
    }

    const newPostId = await postsRepository.createPost(post, blog)
    const newPost = await postsRepository.findById(newPostId)
    
    return newPost || null
  },
  async changeById(
    post: PostInputModel, id: string
  ): Promise<boolean | null> {
    const currentBlog: BlogViewModel | null = 
      await blogsService.findById(post.blogId)
    const currentPost: PostViewModel | null = 
      await postsRepository.findById(id)
    if (!currentBlog || !currentPost) {
      return null
    }
    const changedPost = await postsRepository.changeById(post, id, currentBlog, currentPost)
    return changedPost
  },
  async findById(
    id: string
  ): Promise<PostViewModel | null> {
    return await postsRepository.findById(id)
  },
  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await postsRepository.deleteById(id)
    return res
  },
}