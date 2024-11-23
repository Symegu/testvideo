import { PostModel, PostViewModel } from "../../types/db-types/post-db"
import { PostInputModel } from "../../types/input-output-types/post-types"
import { postsCollection } from "../../db/mongoDb"
import { ObjectId } from "mongodb"
import { BlogViewModel } from "../../types/db-types/blog-db"


export const postsRepository = {
  async deleteById(id: string): Promise<boolean> {
    const res = await postsCollection.deleteOne({ _id: new ObjectId(id) })
    return res.deletedCount === 1
  },
  async createPost(
    post: PostInputModel,
    currentBlog: BlogViewModel
  ): Promise<string> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newPost: PostModel = {
      _id: new ObjectId(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: currentBlog.id,
      blogName: currentBlog.name,
      createdAt: createdAtISO
    }
    const res = await postsCollection.insertOne(newPost)

    return res.insertedId.toString()
  },
  async changeById(
    post: PostInputModel,
    id: string,
    currentBlog: BlogViewModel,
    currentPost: PostViewModel
  ): Promise<boolean> {
    const changedPost = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: currentBlog.name,
      createdAt: currentPost.createdAt
    }
    const res = await postsCollection.updateOne(
      { _id: new ObjectId(id) }, { $set: { ...changedPost } }
    )

    return res.matchedCount === 1
  }
}