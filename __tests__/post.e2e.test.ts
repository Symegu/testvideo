import { req } from './test-helpers'
import { codedAuth, commentValid, createBlog, createBlogAndPost, createUserFromAdmin, postValid } from './datasets'
import { SETTINGS } from '../src/settings'
import { PostInputModel } from '../src/types/input-output-types/post-types'
import { MongoClient } from 'mongodb'
import { runDB, BlogModelClass, PostModelClass } from '../src/db/mongoDb'
import { BlogInputModel } from '../src/types/input-output-types/blog-types'
import { PostsQueryRepository } from '../src/modules/posts/postsQueryRepository'
import { BlogsQueryRepository } from '../src/modules/blogs/blogsQueryRepository'
import { container } from '../src/modules/other/composition-root'

let client: MongoClient
let blogsQueryRepository: BlogsQueryRepository
let postsQueryRepository: PostsQueryRepository
describe('/posts', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    const result = await runDB(SETTINGS.MONGO_URL, true)
    blogsQueryRepository = container.get(BlogsQueryRepository)
    postsQueryRepository = container.get(PostsQueryRepository)
    if (result) {
      await PostModelClass.deleteMany({})
      await BlogModelClass.deleteMany({})
    } else {
      throw new Error("Unable to connect to the database")
    }
    // await runDB(SETTINGS.MONGO_URL, true)
    // await postsCollection.drop()
  })
  afterAll(async () => {
    await BlogModelClass.deleteMany({})
    await PostModelClass.deleteMany({})
  })

  it('should get empty array', async () => {
    //setPostsDB() // очистка базы данных если нужно

    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

    expect(res.body.items.length).toBe(0) // проверяем ответ эндпоинта
  })

  it('should create blog and post for this blog', async () => {
    const blog = await createBlog()

    const res = await req// отправка данных
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(postValid(blog.blogId))
      .expect(201)

    console.log(res.body)
  })

  it('should create blog and post for this blog', async () => {
    const blog = await createBlog()

    const res = await req// отправка данных
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(postValid(blog.blogId))
      .expect(201)

    console.log(res.body)
  })
  it('shouldn\'t create | valid but unauthorized', async () => {
    const blog = await createBlog()

    const res = await req// отправка данных
      .post(SETTINGS.PATH.POSTS)
      .send(postValid(blog.blogId))
      .expect(401)

    console.log(res.body)
  })
  it('shouldn\'t create | invalid data', async () => {

    const newPost: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "1234511111"
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost) // отправка данных
      .expect(400)

    console.log(res.body)
  })

  it('shouldn\'t create | invalid data', async () => {

    const newBlog: BlogInputModel = {
      "name": "string",
      "description": "string",
      "websiteUrl": "https://qwerty.com"
    }

    const blog = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newBlog)

    const newPost: PostInputModel = {
      "title": "string 12345678989172387834456389476582736582123123123123",
      "shortDescription": "string",
      "content": "string",
      "blogId": blog.body.id.toString()
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost) // отправка данных
      .expect(400)

    console.log(res.body)
  })
  it('should get not empty array', async () => {

    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200)

    console.log(res.body)

    expect(res.body.items.length).toBe(2)
  })
  it('shouldn\'t find', async () => {
    //setPostsDB()

    const res = await req
      .get(SETTINGS.PATH.POSTS + '/1')
      .expect(404)

    console.log(res.body)
  })
  it('should find', async () => {
    //setPostsDB()
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const res = await req
      .get(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .expect(200)

    console.log(res.body)
  })
  it('should change', async () => {
    const blogId = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const changedBlog: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": blogId.items[0].id.toString()
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(changedBlog)
      .expect(204)

    console.log(res.body)
  })
  it('should\'t change | unauthorized', async () => {
    const blogId = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const changedBlog: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": blogId.items[0].id.toString()
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .send(changedBlog)
      .expect(401)

    console.log(res.body)
  })
  it('should\'t change | invalid data', async () => {
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const changedBlog: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345678678678678678"
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(changedBlog)
      .expect(400)

    console.log(res.body)
  })
  it('should\'t change | invalid data', async () => {
    const blogId = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const changedBlog: PostInputModel = {
      "title": "string 12345678678678678678 12345678678678678678",
      "shortDescription": "string",
      "content": "string",
      "blogId": blogId.items[0].id.toString()
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(changedBlog)
      .expect(400)

    console.log(res.body)
  })
  it('shouldn\'t delete | no matching id', async () => {

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(404)

    console.log(res.body)
  })
  it('shouldn\'t delete | unauthorized', async () => {
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const res = await req
      .delete(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .expect(401)

    console.log(res.body)
  })
  it('should delete', async () => {
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const res = await req
      .delete(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(204)

    console.log(res.body)
  })

  it('should not get posts comments | empty post', async () => {
    const ids = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')
    const res = await req
      .delete(SETTINGS.PATH.POSTS + `/${ids.items[0].id.toString()}/comments`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(404)

    console.log(res.body)
  })

  it('should create and login user and posts comment', async () => {

    const user = await createUserFromAdmin()
    const post = await createBlogAndPost()

    const res = await req
      .post(SETTINGS.PATH.POSTS + `/${post.postId}/comments`)
      .set({ 'Authorization': 'Bearer ' + user.token })
      .send(commentValid())
      .expect(201)

    console.log(res.body)
  })

  it('should not create and login user and posts comment | unauthorized', async () => {
    //const user = await createUserFromAdmin()
    const post = await createBlogAndPost()

    const res = await req
      .post(SETTINGS.PATH.POSTS + `/${post.postId}/comments`)
      // .set({ 'Authorization': 'Bearer ' + user.token })
      .send(commentValid())
      .expect(401)

    console.log(res.body)
  })

  it('should get posts comments', async () => {
    const user = await createUserFromAdmin()
    const post = await createBlogAndPost()
    const comment = await req
      .post(SETTINGS.PATH.POSTS + `/${post.postId}/comments`)
      .set({ 'Authorization': 'Bearer ' + user.token })
      .send(commentValid())
      .expect(201)

    const res = await req
      .get(SETTINGS.PATH.POSTS + `/${post.postId}/comments`)
      .set({ 'Authorization': 'Bearer ' + user.token })
      .expect(200)

    console.log(res.body)
    expect(res.body.items.length).toBe(1)
  })

})