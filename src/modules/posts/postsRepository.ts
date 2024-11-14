import { PostViewModel } from "../../db/post-db"
import { PostInputModel } from "../../input-output-types/post-types"
import { postsCollection } from "../../db/mongoDb"
import { ObjectId } from "mongodb"
import { BlogViewModel } from "../../db/blog-db"


export const postsRepository = {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null
  ): Promise<PostViewModel[]> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i'}
    }

    return await postsCollection
      .find({filter}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()
  },
  async getPostsCount(
    searchNameTerm: string | null
  ): Promise<number> {
    let filter:any = {}
    if (searchNameTerm) {
      filter.title = {$regex: searchNameTerm, $options: 'i'}
    }

    return await postsCollection.countDocuments(filter)
  },
  async findById(id: string): Promise<PostViewModel | null> {
    return await postsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  },
  async findByUUID(_id: ObjectId): Promise<PostViewModel | null> {
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
    const newPost: PostViewModel = {
      id: new Date().toISOString() + Math.random(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: currentBlog.id,
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
    const changedPost: PostViewModel = {
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