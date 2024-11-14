import { blogsRepository } from "./blogsRepository"

export const blogsService = {
  async getBlogs (
    pageNumber: number, 
    pageSize: number, 
    sortBy: string, 
    sortDirection: 'asc' | 'desc', 
    searchNameTerm: string | null
  ) {
    const blogs = await blogsRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    const blogsCount = await blogsRepository.getBlogsCount(searchNameTerm)
    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: blogsCount,
      items: blogs
    }
  },
  // async findByUUID(_id: ObjectId): Promise<BlogModel | null> {
  //   return await blogsCollection.findOne({ _id: _id }, { projection: { _id: 0 } })
  // },
  async findById(id: string): Promise<BlogModel | null> {
    // return db.blogs.find(blog => blog.id === id)
    return await blogsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  },
  // async createBlog(blog: BlogInputType): Promise<ObjectId> {
  //   const dateNow = Date.now()
  //   const createdAtISO = new Date(dateNow).toISOString()
  //   const newBlog: BlogModel = {
  //     id: new Date().toISOString() + Math.random(),
  //     name: blog.name,
  //     description: blog.description,
  //     websiteUrl: blog.websiteUrl,
  //     createdAt: createdAtISO,
  //     isMembership: false
  //   }
  //   // db.blogs.push(newBlog)
  //   const res = await blogsCollection.insertOne(newBlog)
  //   return res.insertedId
  // },
  // async changeById(blog: BlogInputType, id: string): Promise<boolean | null> {
  //   const currentBlog = await blogsRepository.findById(id)
  //   if (!currentBlog) {
  //     return null
  //   }
  //   const changedBlog: BlogModel = {
  //     id: id,
  //     name: blog.name,
  //     description: blog.description,
  //     websiteUrl: blog.websiteUrl,
  //     createdAt: currentBlog.createdAt,
  //     isMembership: false
  //   }
  //   // db.blogs = db.blogs.map(blog => blog.id === id ? changedBlog : blog)
  //   const res = await blogsCollection.updateOne(
  //     { id }, { $set: { ...changedBlog } }
  //   )
  //   return res.matchedCount === 1
  // },
  // async findByUUID(_id: ObjectId): Promise<BlogModel | null> {
  //   return await blogsCollection.findOne({ _id: _id }, { projection: { _id: 0 } })
  // },
  // async findById(id: string): Promise<BlogModel | null> {
  //   // return db.blogs.find(blog => blog.id === id)
  //   return await blogsCollection.findOne({ id: id }, { projection: { _id: 0 } })
  // }
}