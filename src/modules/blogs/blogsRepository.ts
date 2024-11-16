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
    
    console.log("searchNameTerm getBlogs:", searchNameTerm);
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }

    const blogs = await blogsCollection
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray() 

    return blogs.map(blog => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
    })) as BlogViewModel[]
  },
  async getBlogsCount(
    searchNameTerm: string | null
  ): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    return await blogsCollection.countDocuments(filter)
  },
  async findById(
    id: string
  ): Promise<BlogViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const _id = new ObjectId(id);
    const blog = await blogsCollection.findOne(
        { _id },
        { projection: { _id: 0 } }
    );
    if (!blog) {
      return null;
    }
    
    return {...blog, id: _id.toString()};
  },
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
    blog: BlogInputModel, id: string
  ): Promise<boolean | null> {
    const currentBlog = await blogsRepository.findById(id)
    if (!currentBlog) {
      return null
    }
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