import { BlogInputModel } from "../../types/input-output-types/blog-types"
import { BlogModelClass } from '../../db/mongoDb'
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"

export const blogsRepository = {

  async deleteById(
    id: string
  ): Promise<Result<boolean | null>> {
    const blogInstance = await BlogModelClass.findOne({ _id: id })
    if (!blogInstance) return {
      status: ResultStatus.NotFound,
      errorMessage: 'Blog with this Id not found in repository ::changeById',
      data: null
    }
    const res = await blogInstance.deleteOne()

    return {
      status: ResultStatus.Success,
      data: res.deletedCount === 1
    }
  },

  async createBlog(
    blog: BlogInputModel
  ): Promise<string> {
    const blogInstance = new BlogModelClass(blog)
    blogInstance.isMembership = false
    const res = await blogInstance.save()
    return res._id.toString()
  },

  async changeById(
    blog: BlogInputModel,
    id: string
  ): Promise<Result<boolean | null>> {

    const blogInstance = await BlogModelClass.findOne({ _id: id })
    if (!blogInstance) return {
      status: ResultStatus.NotFound,
      errorMessage: 'Blog with this Id not found in repository ::changeById',
      data: null
    }

    blogInstance.set({
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl
    })
    const res = blogInstance.isModified()
    if (!res) return {
      status: ResultStatus.BadRequest,
      errorMessage: 'Changed blog is equal with current ::changeById',
      data: null
    }
    await blogInstance.save()

    return {
      status: ResultStatus.Success,
      data: res
    }
  }
}