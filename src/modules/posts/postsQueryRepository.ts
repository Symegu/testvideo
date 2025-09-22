import { PostViewModel, PostModel } from "../../types/db-types/post-db"
import { LikeModelClass, PostModelClass } from "../../db/mongoDb"
import { PaginatorPostModel } from "../../types/paginator-types"
import { injectable } from "inversify"
import { LikeStatus } from "../../types/db-types/comment-db"

@injectable()
export class PostsQueryRepository {
  async getAllPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null,
    blogId?: string | null,
    userId?: string | null
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

    // const mappedPosts: PostViewModel[] = dbPosts.map(post => {
    //   return this.mapPostToOutput(post)
    // })

    const mappedPosts: PostViewModel[] = []
    // собираем parentIds чтобы оптимизировать myStatus запрос (в будущем)
    for (const post of dbPosts) {
      mappedPosts.push(await this.mapPostToOutput(post, userId))
    }
    //
    
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
    id: string,
    userId?: string | null
  ): Promise<PostViewModel | null> {
    
    const post = await PostModelClass.findOne(
      { _id: id }
    )
    if (!post) {
      return null;
    }

    return this.mapPostToOutput(post, userId)
  }

  async mapPostToOutput(post: PostModel, userId?: string | null): Promise<PostViewModel> {
  const likesCount = post.extendedLikesInfo?.likesCount ?? 0
  const dislikesCount = post.extendedLikesInfo?.dislikesCount ?? 0

  // compute myStatus from likes collection (one query)
  let myStatus = LikeStatus.None
  if (userId) {
    const like = await LikeModelClass.findOne({ parentId: post.id, userId })
    myStatus = like?.status ?? LikeStatus.None
  }

  // newestLikes: query last 3 likes with status Like and map to required shape
  const newestDocs = await LikeModelClass.find({ parentId: post.id, status: LikeStatus.Like })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean()

  const newestLikes = newestDocs.map(d => ({
    // description: d.userLogin ?? '',
    addedAt: (d.createdAt as Date).toISOString(),
    userId: d.userId,
    login: d.userLogin ?? ''
  }))

  return {
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes
    }
  } as PostViewModel
}
}