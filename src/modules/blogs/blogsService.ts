import { blogsRepository } from "./blogsRepository"

export const blogsService = {
  async getBlogs(
    pageNumber: number, 
    pageSize: number, 
    sortBy: string, 
    sortDirection: 'asc' | 'desc', 
    searchNameTerm: string | null) 
  {
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
  
}