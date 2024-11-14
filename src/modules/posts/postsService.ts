import { ObjectId } from "mongodb"
import { PostViewModel } from "../../db/post-db"
import { postsRepository } from './postsRepository';
import { PostInputModel } from "../../input-output-types/post-types"
import { BlogViewModel } from "../../db/blog-db";
import { blogsService } from "../blogs/blogsService";

export const postsService = {
  // async getPosts(): Promise<PostModel[]> {
  //   // return db.posts
  //   return postsRepository.find({}, { projection: { _id: 0 } }).toArray()
  // },
  
  async createPost(
    post: PostInputModel
  ): Promise<PostViewModel | null> {
    const currentBlog: BlogViewModel | null = 
      await blogsService.findById(post.blogId)
    if (!currentBlog) {
      return null
    }
    const newPostId = await postsRepository.createPost(post, currentBlog)
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