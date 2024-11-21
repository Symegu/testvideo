import { ObjectId } from "mongodb"
import { PostViewModel, PostModel } from "../../db/post-db"
import { postsCollection } from "../../db/mongoDb"
import { PaginatorPostModel } from "../other/paginator-types"

export const postsQueryRepository = {
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
    const dbPosts= await postsCollection
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()
    
    const mappedPosts: PostViewModel[] = dbPosts.map(post => {
      return this.mapPostToOutput(post)
    })
    const postsCount = await this.getPostsCount(searchNameTerm)
    const posts = {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: mappedPosts
    }
    return posts
  },

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
    const count = await postsCollection.countDocuments(filter)
    console.log(count, 'count');
    return count
  },

  async findById(
    id: string
  ): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id);
    const post = await postsCollection.findOne(
        { _id },
        { projection: { _id: 0 } }
    );
    if (!post) {
      return null;
    }
    
    return this.mapPostToOutput(post)
  },

  mapPostToOutput(post: PostModel) {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    } as PostViewModel
  }
}