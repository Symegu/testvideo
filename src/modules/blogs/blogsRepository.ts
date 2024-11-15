import { BlogModel, BlogViewModel } from "../../db/blog-db"
import { BlogInputModel } from "../../input-output-types/blog-types"
import { blogsCollection } from '../../db/mongoDb';
import { ObjectId } from "mongodb"

export const blogsRepository = {
  async getBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null
  ): Promise<BlogViewModel[]> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    return await blogsCollection
      .find(filter, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray() as BlogViewModel[]
  },
  async getBlogsCount(
    searchNameTerm: string | null
  ): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }
    return await blogsCollection.countDocuments(filter)
  },
  async findByUUID(
    _id: ObjectId
  ): Promise<BlogViewModel | null> {
    return await blogsCollection.findOne({ _id: _id }, { projection: { _id: 0 } })
  },
  async findById(
    id: string
  ): Promise<BlogViewModel | null> {
    return await blogsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  },
  async deleteById(
    id: string
  ): Promise<boolean> {
    const res = await blogsCollection.deleteOne({ id: id })
    return res.deletedCount === 1
  },
  async createBlog(
    blog: BlogInputModel
  ): Promise<ObjectId> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newBlog: BlogModel = {
      id: new Date().toISOString() + Math.random(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: createdAtISO,
      isMembership: false
    }
    const res = await blogsCollection.insertOne(newBlog)
    return res.insertedId
  },
  async changeById(
    blog: BlogInputModel, id: string
  ): Promise<boolean | null> {
    const currentBlog = await blogsRepository.findById(id)
    if (!currentBlog) {
      return null
    }
    const changedBlog: BlogModel = {
      id: id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: currentBlog.createdAt,
      isMembership: false
    }
    const res = await blogsCollection.updateOne(
      { id }, { $set: { ...changedBlog } }
    )
    return res.matchedCount === 1
  }
}