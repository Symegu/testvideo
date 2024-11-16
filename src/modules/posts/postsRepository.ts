import { PostModel, PostViewModel } from "../../db/post-db"
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
    searchNameTerm: string | null,
    blogId?: string | null
  ): Promise<PostViewModel[]> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    if (blogId) {
      filter.blogId = { $regex: blogId }
    }
    console.log('getPosts', filter);
    
    const posts = await postsCollection
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()

    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      createdAt: post.createdAt,
      blogId: post.blogId,
      blogName: post.blogName
    })) as PostViewModel[]
  },
  async getPostsCount(
    searchNameTerm: string | null,
    blogId?: string | null
  ): Promise<number> {
    let filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }
    if (blogId) {
      filter.blogId = { $regex: blogId }
    }
    return await postsCollection.countDocuments(filter)
  },
  async findById(
    id: string
  ): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null
    }
    const _id = new ObjectId(id)
    const post = await postsCollection.findOne(
      { _id },
      { projection: { _id: 0 } }
    )
    if (!post) {
      return null
    }
    return {...post, id: _id.toString()}
  },
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