import { req } from './test-helpers'
import { setBlogsDB, setPostsDB } from '../src/db/localDb'
import { codedAuth } from './datasets'
import { SETTINGS } from '../src/settings'
import { PostInputModel } from '../src/input-output-types/post-types'
import { MongoClient } from 'mongodb'
import { runDB, postsCollection } from '../src/db/mongoDb'

let client: MongoClient
describe('/posts', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    const result = await runDB(SETTINGS.MONGO_URL, true);
    if (result) {
        client = result.client
        await postsCollection.deleteMany({})
    } else {
        throw new Error("Unable to connect to the database")
    }
    // await runDB(SETTINGS.MONGO_URL, true)
    // await postsCollection.drop()
})
afterAll(async () => {
    await client.close() // Закрываем сервер после тестов
})

  it('should get empty array', async () => {
    //setPostsDB() // очистка базы данных если нужно

    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

    expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
  })
  it('should get not empty array', async () => {
    await setPostsDB() // заполнение базы данных начальными данными если нужно
    
    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200)

    console.log(res.body)

    expect(res.body.length).toBe(2)
  })
  it('should create', async () => {
    //setPostsDB()
    await setBlogsDB()
    const newPost: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost) // отправка данных
      .expect(201)

    console.log(res.body)
  })
  it('shouldn\'t create | valid but unauthorized', async () => {
   //setPostsDB()
    const newPost: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .send(newPost) // отправка данных
      .expect(401)

    console.log(res.body)
  })
  it('shouldn\'t create | valid but authorize invalid', async () => {
   //setPostsDB()
    const newPost: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Bearer ' + codedAuth })
      .send(newPost) // отправка данных
      .expect(401)

    console.log(res.body)
  })

  it('shouldn\'t create | invalid data', async () => {
   //setPostsDB()
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
   //setPostsDB()
    const newPost: PostInputModel = {
      "title": "string 12345678989172387834456389476582736582123123123123",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(newPost) // отправка данных
      .expect(400)

    console.log(res.body)
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

    const res = await req
      .get(SETTINGS.PATH.POSTS + '/1234567')
      .expect(200)

    console.log(res.body)
  })
  it('should change', async () => {
    //setPostsDB()
    const changedBlog: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + '/1234567')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(changedBlog)
      .expect(204)

    console.log(res.body)
  })
  it('should\'t change | unauthorized', async () => {
    //setPostsDB()
    const changedBlog: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + '/1234567')
      .send(changedBlog)
      .expect(401)

    console.log(res.body)
  })
  it('should\'t change | invalid data', async () => {
    //setPostsDB()
    const changedBlog: PostInputModel = {
      "title": "string",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345678678678678678"
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + '/1234567')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(changedBlog)
      .expect(400)

    console.log(res.body)
  })
  it('should\'t change | invalid data', async () => {
    //setPostsDB()
    const changedBlog: PostInputModel = {
      "title": "string 12345678978978997987978987987978987987978",
      "shortDescription": "string",
      "content": "string",
      "blogId": "12345"
    }
    const res = await req
      .put(SETTINGS.PATH.POSTS + '/1234567')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(changedBlog)
      .expect(400)

    console.log(res.body)
  })
  it('shouldn\'t delete | no matching id', async () => {
    //setPostsDB()

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(404)

    console.log(res.body)
  })
  it('shouldn\'t delete | unauthorized', async () => {
    //setPostsDB()

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1234567')
      .expect(401)

    console.log(res.body)
  })
  it('should delete', async () => {
    //setPostsDB()

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1234567')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(204)

    console.log(res.body)
  })
  
})