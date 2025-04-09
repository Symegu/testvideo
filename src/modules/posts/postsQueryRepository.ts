import { PostViewModel, PostModel } from "../../types/db-types/post-db"
import { PostModelClass } from "../../db/mongoDb"
import { PaginatorPostModel } from "../../types/paginator-types"
import { injectable } from "inversify"

@injectable()
export class PostsQueryRepository {
  async getAllPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null,
    blogId?: string | null
  ): Promise<PaginatorPostModel> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    if (blogId) {
      filter.blogId = { $regex: blogId }
    }
    console.log('getPosts', filter)
    const dbPosts = await PostModelClass
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })

    const mappedPosts: PostViewModel[] = dbPosts.map(post => {
      return this.mapPostToOutput(post)
    })
    const postsCount = await this.getPostsCount(searchNameTerm, blogId)
    const posts = {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: mappedPosts
    }
    return posts
  }

  async getPostsCount(
    searchNameTerm: string | null,
    blogId?: string | null
  ): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm, $options: 'i' }
    }

    if (blogId) {
      filter.blogId = { $regex: blogId }
    }
    const count = await PostModelClass.countDocuments(filter)
    console.log(count, 'count');
    return count
  }

  async findById(
    id: string
  ): Promise<PostViewModel | null> {
    
    const post = await PostModelClass.findOne(
      { _id: id }
    )
    if (!post) {
      return null;
    }

    return this.mapPostToOutput(post)
  }

  mapPostToOutput(post: PostModel) {
    return {
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString()
    } as PostViewModel
  }
}