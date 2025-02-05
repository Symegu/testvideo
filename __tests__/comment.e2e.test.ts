import { MongoClient } from "mongodb"
import { runDB, postsCollection, blogsCollection, commentsCollection } from "../src/db/mongoDb"
import { SETTINGS } from "../src/settings"
import { postsQueryRepository } from "../src/modules/posts/postsQueryRepository"
import { BlogInputModel } from "../src/types/input-output-types/blog-types"
import { CommentInputModel } from "../src/types/input-output-types/comment-types"
import { PostInputModel } from "../src/types/input-output-types/post-types"
import { codedAuth } from "./datasets"
import { req } from "./test-helpers"

let client: MongoClient
describe('/comments', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    const result = await runDB(SETTINGS.MONGO_URL);
    if (result) {
      client = result.client
      await commentsCollection.deleteMany({})
      await postsCollection.deleteMany({})
      await blogsCollection.deleteMany({})
    } else {
      throw new Error("Unable to connect to the database")
    }
  })
  afterAll(async () => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await client.close() // Закрываем сервер после тестов
  })

  it('should create blog, post for blog, comment for post and find this comment', async () => {
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
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": blog.body.id.toString()
    }
    const post = await req// отправка данных
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost)

    const postIds = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')

    const newComment: CommentInputModel = {
      content: 'valid comment content'
    }

    const user = await req
      .post(SETTINGS.PATH.AUTH + '/registration')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send({ login: 'masterUser', password: 'password', email: 'email@mail.com' })

    const token = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send({ loginOrEmail: 'masterUser', password: 'password' })
    console.log(user)

    const comment = await req
      .post(SETTINGS.PATH.POSTS + `/${postIds.items[0].id.toString()}/comments`)
      .set({ 'Authorization': 'Bearer ' + token.body.accessToken.toString() })
      .send(newComment)

    const res = await req
      .get(SETTINGS.PATH.COMMENTS + `/${comment.body.id.toString()}`)
      .expect(200)
    console.log(res.body)
  })

  it('should create blog, post for blog, comment for post and change this comment', async () => {
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
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": blog.body.id.toString()
    }
    const post = await req// отправка данных
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost)

    const postIds = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')

    const newComment: CommentInputModel = {
      content: 'valid comment content'
    }

    const user = await req
      .post(SETTINGS.PATH.AUTH + '/registration')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send({ login: 'masterUser', password: 'password', email: 'email@mail.com' })

    const token = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send({ loginOrEmail: 'masterUser', password: 'password' })
    console.log(user)

    const comment = await req
      .post(SETTINGS.PATH.POSTS + `/${postIds.items[0].id.toString()}/comments`)
      .set({ 'Authorization': 'Bearer ' + token.body.accessToken.toString() })
      .send(newComment)

    const res = await req
      .put(SETTINGS.PATH.COMMENTS + `/${comment.body.id.toString()}`)
      .set({ 'Authorization': 'Bearer ' + token.body.accessToken.toString() })
      .send({ content: 'valid changed content' })
      .expect(204)
    console.log(res.body)
  })

  it('should create blog, post for blog, comment for post and delete this comment', async () => {
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
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": blog.body.id.toString()
    }
    const post = await req// отправка данных
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost)

    const postIds = await postsQueryRepository.getAllPosts(1, 10, 'name', 'asc', 'str')

    const newComment: CommentInputModel = {
      content: 'valid comment content'
    }

    const user = await req
      .post(SETTINGS.PATH.AUTH + '/registration')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send({ login: 'masterUser', password: 'password', email: 'email@mail.com' })

    const token = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send({ loginOrEmail: 'masterUser', password: 'password' })
    console.log(user)

    const comment = await req
      .post(SETTINGS.PATH.POSTS + `/${postIds.items[0].id.toString()}/comments`)
      .set({ 'Authorization': 'Bearer ' + token.body.accessToken.toString() })
      .send(newComment)

    const res = await req
      .delete(SETTINGS.PATH.COMMENTS + `/${comment.body.id.toString()}`)
      .set({ 'Authorization': 'Bearer ' + token.body.accessToken.toString() })
      .expect(204)
    console.log(res.body)
  })
})