// ...

import { PostDBType } from "../../db/post-db"
import { PostInputType } from "../../input-output-types/post-types"
import { db } from "../../db/db"
import { blogsRepository } from "../blogs/blogsRepository"


export const postsRepository = {
  getPosts() {
    return db.posts
  },
  findById(id: string) {
    return db.posts.find(post => post.id === id)
  },
  deleteById(id: string) {
    db.posts = db.posts.filter(post => post.id !== id)
    return id
  },
  createPost(post: PostInputType) {
    const currentBlog = blogsRepository.findById(post.blogId)
    const newPost: PostDBType = {
      id: new Date().toISOString() + Math.random(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: currentBlog!.name
    }
    db.posts.push(newPost)
    return newPost.id
  },
  changeById(post: PostInputType, id: string) {
    const currentBlog = blogsRepository.findById(post.blogId)
    const changedPost: PostDBType = {
      id: id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: currentBlog!.name
    }
    db.posts = db.posts.map(post => post.id === id ? changedPost : post)
    return changedPost.id
  }
}