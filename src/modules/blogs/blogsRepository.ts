import { BlogModel, BlogViewModel } from "../../types/db-types/blog-db"
import { BlogInputModel } from "../../types/input-output-types/blog-types"
import { blogsCollection } from '../../db/mongoDb';
import { ObjectId } from "mongodb"

export const blogsRepository = {

  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
    return res.deletedCount === 1
  },
  async createBlog(
    blog: BlogInputModel
  ): Promise<string> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newBlog: BlogModel = {
      _id: new ObjectId(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: createdAtISO,
      isMembership: false
    }
    const res = await blogsCollection.insertOne(newBlog)
    return res.insertedId.toString()
  },
  async changeById(
    blog: BlogInputModel,
    id: string,
    currentBlog: BlogViewModel
  ): Promise<boolean | null> {
    const changedBlog = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: currentBlog.createdAt,
      isMembership: false
    }
    const res = await blogsCollection.updateOne(
      { _id: new ObjectId(id) }, { $set: { ...changedBlog } }
    )
    return res.matchedCount === 1
  }
}