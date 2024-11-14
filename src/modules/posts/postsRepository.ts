import { PostModel, PostViewModel } from "../../db/post-db"
import { PostInputModel } from "../../input-output-types/post-types"
import { postsCollection } from "../../db/mongoDb"
import { ObjectId } from "mongodb"
import { BlogViewModel } from "../../db/blog-db"


export const postsRepository = {
  async getPosts(): Promise<PostModel[]> {
    // return db.posts
    return postsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },
  async findById(id: string): Promise<PostModel | null> {
    return await postsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  },
  async findByUUID(_id: ObjectId): Promise<PostModel | null> {
    return await postsCollection.findOne({ _id: _id }, { projection: { _id: 0 } })
  },
  async deleteById(id: string): Promise<boolean> {
    const res = await postsCollection.deleteOne({ id: id })
    return res.deletedCount === 1
  },
  async createPost(
    post: PostInputModel,
    currentBlog: BlogViewModel
  ): Promise<ObjectId> {
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
    const res = await postsCollection.insertOne(newPost)
    return res.insertedId
  },
  async changeById(
    post: PostInputModel,
    id: string,
    currentBlog: BlogViewModel,
    currentPost: PostViewModel
  ): Promise<boolean> {
    const changedPost: PostModel = {
      id: id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: currentBlog.name,
      createdAt: currentPost.createdAt
    }
    const res = await postsCollection.updateOne(
      { id }, { $set: { ...changedPost } }
    )
    return res.matchedCount === 1
  }
}