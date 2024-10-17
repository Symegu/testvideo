import { BlogDBType } from "../../db/blog-db"
import { BlogInputType } from "../../input-output-types/blog-types"
import { db } from "../../db/db"

export const blogsRepository = {
  getBlogs() {
    return db.blogs
  },
  findById(id: string) {
    return db.blogs.find(blog => blog.id === id)
  },
  deleteById(id: string) {
    db.blogs = db.blogs.filter(blog => blog.id !== id)
    return id
  },
  createBlog(blog: BlogInputType) {
    const newBlog: BlogDBType = {
      id: new Date().toISOString() + Math.random(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl
    }
    db.blogs.push(newBlog)
    return newBlog.id
  },
  changeById(blog: BlogInputType, id: string) {
    const changedBlog: BlogDBType = {
      id: id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl
    }
    db.blogs = db.blogs.map(blog => blog.id === id ? changedBlog : blog)
    return changedBlog.id
  }
}