import { ObjectId } from "mongodb"
import { BlogViewModel, BlogModel } from "../../types/db-types/blog-db"
import { BlogModelClass } from "../../db/mongoDb"
import { PaginatorBlogModel } from "../../types/paginator-types"
import { injectable } from "inversify"

@injectable()
export class BlogsQueryRepository {
  
  async getAllBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null
  ): Promise<PaginatorBlogModel> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    console.log(filter, 'filter');
    const dbBlogs = await BlogModelClass
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })

    const mappedBlogs: BlogViewModel[] = dbBlogs.map(blog => {
      return this.mapBlogToOutput(blog)
    })
    const blogsCount = await this.getBlogsCount(searchNameTerm)
    const blogs = {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: blogsCount,
      items: mappedBlogs
    }
    return blogs
  }

  async getBlogsCount(
    searchNameTerm: string | null
  ): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    const count = await BlogModelClass.countDocuments(filter)
    console.log(count, 'count');
    return count
  }

  async findById(
    id: string
  ): Promise<BlogViewModel | null> {

    const blog = await BlogModelClass.findOne(
      { id }
    )
    if (!blog) {
      return null;
    }

    return this.mapBlogToOutput(blog)
  }

  mapBlogToOutput(blog: BlogModel) {
    return {
      id: blog.id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership
    } as BlogViewModel
  }
}