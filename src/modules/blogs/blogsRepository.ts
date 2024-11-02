import { BlogModel } from "../../db/blog-db"
import { BlogInputType } from "../../input-output-types/blog-types"
// import { db } from "../../db/localDb"
import { blogsCollection } from '../../db/mongoDb';
import { ObjectId } from "mongodb"

export const blogsRepository = {
  async getBlogs(): Promise<BlogModel[]> {
    // return db.blogs
    return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },
  async findByUUID(_id: ObjectId): Promise<BlogModel | null> {
    return await blogsCollection.findOne({_id: _id}, { projection: { _id: 0 } })
  },
  async findById(id: string): Promise<BlogModel | null> {
    // return db.blogs.find(blog => blog.id === id)
    return await blogsCollection.findOne({id: id}, { projection: { _id: 0 } })
  },
  async deleteById(id: string): Promise<boolean> {
    // db.blogs = db.blogs.filter(blog => blog.id !== id)
    // return id
    const res = await blogsCollection.deleteOne({id: id})
    return res.deletedCount === 1
  },
  async createBlog(blog: BlogInputType): Promise<ObjectId> {
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
    // db.blogs.push(newBlog)
    const res = await blogsCollection.insertOne(newBlog)
    return res.insertedId
  },
  async changeById(blog: BlogInputType, id: string): Promise<boolean> {
    const currentBlog = await blogsRepository.findById(id)
    const changedBlog: BlogModel = {
      id: id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: currentBlog!.createdAt,
      isMembership: false 
    }
    // db.blogs = db.blogs.map(blog => blog.id === id ? changedBlog : blog)
    const res = await blogsCollection.updateOne(
      { id }, { $set: {...changedBlog}}
    )
    return res.matchedCount === 1
  }
}