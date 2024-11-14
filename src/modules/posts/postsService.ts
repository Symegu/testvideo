import { ObjectId } from "mongodb"
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
    // blogId?: string | null,
  ): Promise<PaginatorPostModel> {
    // let blog: BlogViewModel | null

    // const currentBlog: BlogViewModel | null = 
    //   await blogsService.findById(blogId)
    //   if (!currentBlog) {
    //     return null
    // }
    ///////!providedBlog ? blog = currentBlog : blog = providedBlog
    const posts = await postsRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    const postsCount = await postsRepository.getPostsCount(searchNameTerm)
    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts
    }
  },
  async createPost(
    post: PostInputModel,
    providedBlog?: BlogViewModel
  ): Promise<PostViewModel | null> {
    let blog: BlogViewModel | null
    const currentBlog: BlogViewModel | null = 
      await blogsService.findById(post.blogId)
      if (!currentBlog) {
        return null
    }
    !providedBlog ? blog = currentBlog : blog = providedBlog
    const newPostId = await postsRepository.createPost(post, blog)
    const newPost = await postsRepository.findByUUID(newPostId)
    return newPost
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
  async findByUUID(
    _id: ObjectId
  ): Promise<PostViewModel | null> {
    return await postsRepository.findByUUID(_id)
  },
  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await postsRepository.deleteById(id)
    return res
  },
}