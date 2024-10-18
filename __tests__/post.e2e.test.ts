import { req } from './test-helpers'
import { setDB } from '../src/db/db'
import { codedAuth, dataset1 } from './datasets'
import { SETTINGS } from '../src/settings'
import { PostInputType } from '../src/input-output-types/post-types'

describe('/posts', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    setDB()
  })

  it('should get empty array', async () => {
    // setDB() // очистка базы данных если нужно

    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

    expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
  })
  it('should get not empty array', async () => {
    setDB(dataset1) // заполнение базы данных начальными данными если нужно

    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200)

    console.log(res.body)

    expect(res.body.length).toBe(2)
    expect(res.body[0]).toEqual(dataset1.posts[0])
  })
  it('should create', async () => {
    setDB(dataset1)
    const newPost: PostInputType = {
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
    setDB()
    const newPost: PostInputType = {
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
    setDB()
    const newPost: PostInputType = {
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
    setDB()
    const newPost: PostInputType = {
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
    setDB()
    const newPost: PostInputType = {
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
    setDB(dataset1)

    const res = await req
      .get(SETTINGS.PATH.POSTS + '/1')
      .expect(404)

    console.log(res.body)
  })
  it('should find', async () => {
    setDB(dataset1)

    const res = await req
      .get(SETTINGS.PATH.POSTS + '/1234567')
      .expect(200)

    console.log(res.body)
  })
  it('shouldn\'t delete | no matching id', async () => {
    setDB(dataset1)

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(404)

    console.log(res.body)
  })
  it('shouldn\'t delete | unauthorized', async () => {
    setDB(dataset1)

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1234567')
      .expect(401)

    console.log(res.body)
  })
  it('should delete', async () => {
    setDB(dataset1)

    const res = await req
      .delete(SETTINGS.PATH.POSTS + '/1234567')
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(204)

    console.log(res.body)
  })
  it('should change', async () => {
    setDB(dataset1)
    const changedBlog: PostInputType = {
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
    setDB(dataset1)
    const changedBlog: PostInputType = {
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
    setDB(dataset1)
    const changedBlog: PostInputType = {
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
    setDB(dataset1)
    const changedBlog: PostInputType = {
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
})