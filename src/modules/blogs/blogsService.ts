import { BlogViewModel } from "../../db/blog-db"
import { PaginatorBlogModel } from "../other/paginator-types"
import { blogsRepository } from "./blogsRepository"
import { BlogInputModel } from "../../input-output-types/blog-types"
import { PostInputModel } from "../../input-output-types/post-types"
import { PostViewModel } from "../../db/post-db"
import { postsService } from '../posts/postsService';

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
  async getBlogPosts(
    blogId: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null,
  ) {
    const posts = await postsService.getPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, blogId)

    return posts 
  },
  async findById(
    id: string
  ): Promise<BlogViewModel | null> {
    const blog = await blogsRepository.findById(id)

    if(!blog) {
      return null
    }
    return blog
  },
  async createBlog(
    blog: BlogInputModel
  ): Promise<BlogViewModel | null> {
    const createdBlogId: string = await blogsRepository.createBlog(blog)
    if (!createdBlogId) {
      return null
    }
    const createdBlog = await blogsRepository.findById(createdBlogId)
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