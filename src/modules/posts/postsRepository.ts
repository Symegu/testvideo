import { PostViewModel } from "../../types/db-types/post-db"
import { PostInputModel } from "../../types/input-output-types/post-types"
import { PostModelClass } from "../../db/mongoDb"
import { BlogViewModel } from "../../types/db-types/blog-db"
import { injectable } from "inversify"

@injectable()
export class PostsRepository {
  async deleteById(id: string): Promise<boolean> {
    const res = await PostModelClass.deleteOne({ _id: id })
    return res.deletedCount === 1
  }

  async createPost(
    post: PostInputModel,
    currentBlog: BlogViewModel
  ): Promise<string> {
    const dateNow = Date.now()

    const newPost = new PostModelClass({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: currentBlog.id,
      blogName: currentBlog.name,
      createdAt: new Date(dateNow).toISOString()
    })
    const savedPost = await newPost.save()

    return savedPost.id.toString()
  }

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
    const res = await PostModelClass.updateOne(
      { _id: id }, { $set: { ...changedPost } }
    )

    return res.matchedCount === 1
  }
}