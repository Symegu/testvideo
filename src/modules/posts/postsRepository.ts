// ...

import { PostModel } from "../../db/post-db"
import { PostInputType } from "../../input-output-types/post-types"
import { db } from "../../db/localDb"
import { blogsRepository } from "../blogs/blogsRepository"
import { postsCollection } from "../../db/mongoDb"
import { ObjectId } from "mongodb"


export const postsRepository = {
  async getPosts(): Promise<PostModel[]> {
    // return db.posts
    return postsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },
  async findById(id: string): Promise<PostModel | null> {
    // return db.posts.find(post => post.id === id)
    return await postsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  },
  async findByUUID(_id: ObjectId): Promise<PostModel | null> {
    // return db.posts.find(post => post.id === id)
    return await postsCollection.findOne({ _id: _id }, { projection: { _id: 0 } })
  },
  async deleteById(id: string): Promise<boolean> {
    // db.posts = db.posts.filter(post => post.id !== id)
    // return id
    const res = await postsCollection.deleteOne({ id: id })
    return res.deletedCount === 1
  },
  async createPost(post: PostInputType): Promise<ObjectId | null> {
    const currentBlog = await blogsRepository.findById(post.blogId)
    if (!currentBlog) {
      return null
    }
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newPost: PostModel = {
      id: new Date().toISOString() + Math.random(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: currentBlog.name,
      createdAt: createdAtISO
    }
    // db.posts.push(newPost)
    const res = await postsCollection.insertOne(newPost)
    return res.insertedId
  },
  async changeById(post: PostInputType, id: string): Promise<boolean | null> {
    const currentBlog = await blogsRepository.findById(post.blogId)
    if (!currentBlog) {
      return null
    }
    const changedPost: PostModel = {
      id: id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: currentBlog!.name,
      createdAt: currentBlog!.createdAt
    }
    //db.posts = db.posts.map(post => post.id === id ? changedPost : post)
    const res = await postsCollection.updateOne(
      { id }, { $set: { ...changedPost } }
    )
    return res.matchedCount === 1
  }
}