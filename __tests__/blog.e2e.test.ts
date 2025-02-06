import { req } from './test-helpers'
import { blogValid, codedAuth, createBlogAndPost, postValid } from './datasets'
import { SETTINGS } from '../src/settings'
import { BlogInputModel } from '../src/types/input-output-types/blog-types'
import { runDB, blogsCollection, postsCollection } from '../src/db/mongoDb'
import { MongoClient } from 'mongodb'
import { blogsQueryRepository } from '../src/modules/blogs/blogsQueryRepository'
import { PostInputModel } from '../src/types/input-output-types/post-types'

let client: MongoClient
describe('/blogs', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        const result = await runDB(SETTINGS.MONGO_URL);

        if (result) {
            client = result.client
            await blogsCollection.deleteMany({})
        } else {
            throw new Error("Unable to connect to the database")
        }
    })
    afterAll(async () => {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await client.close() // Закрываем сервер после тестов
    });

    it('should get empty array', async () => {

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.items.length).toBe(0) // проверяем ответ эндпоинта
    })
    it('should create', async () => {

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(blogValid()) // отправка данных
            .expect(201)

        console.log(res.body)
    })
    it('should create', async () => {

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(blogValid()) // отправка данных
            .expect(201)

        console.log(res.body)
    })
    it('shouldn\'t create | valid but unauthorized', async () => {

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(blogValid()) // отправка данных
            .expect(401)

        console.log(res.body)
    })
    it('shouldn\'t create | valid but authorize invalid', async () => {

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Bearer ' + codedAuth })
            .send(blogValid()) // отправка данных
            .expect(401)

        console.log(res.body)
    })
    it('shouldn\'t create | invalid data', async () => {
        //setBlogsDB()
        const newBlog: BlogInputModel = {
            "name": "string 1234567890",
            "description": "string",
            "websiteUrl": "https://qwerty.com"
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog) // отправка данных
            .expect(400)

        console.log(res.body)
    })
    it('shouldn\'t create | invalid data', async () => {
        //setBlogsDB()
        const newBlog: BlogInputModel = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://XyIO0OXFjEfAOnMi55eLn8uhl-g4cZL8v5Tig0.2N8uTKO1j4dUy.YSCL29YpVYfww_slzGgbYt6ewj7cYzV.V9wrDiM.commmmm54754567467547564756"
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newBlog) // отправка данных
            .expect(400)

        console.log(res.body)
    })
    it('should get not empty array', async () => {

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        console.log(res.body)

        expect(res.body.items.length).toBe(2)
    })
    it('shouldn\'t find', async () => {

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .expect(404)

        console.log(res.body)
    })
    it('should find', async () => {

        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')
        const res = await req
            .get(SETTINGS.PATH.BLOGS + `/${ids.items[0].id.toString()}`)
            .expect(200)

        console.log(res.body)
    })
    it('should change', async () => {
        //setBlogsDB()
        const changedBlog: BlogInputModel = {
            "name": "string2",
            "description": "string2",
            "websiteUrl": "https://changed-url2.com"
        }

        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')

        const res = await req
            .put(SETTINGS.PATH.BLOGS + `/${ids.items[1].id.toString()}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(changedBlog)
            .expect(204)

        console.log(res.body)
    })
    it('should\'t change | unauthorized', async () => {
        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')

        const changedBlog: BlogInputModel = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://changed-url.com"
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + `/${ids.items[0].id.toString()}`)
            .send(changedBlog)
            .expect(401)

        console.log(res.body)
    })
    it('should\'t change | invalid data', async () => {
        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')
        const changedBlog: BlogInputModel = {
            "name": "string 1234567890000",
            "description": "string",
            "websiteUrl": "https://changed-url.com"
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + `/${ids.items[0].id.toString()}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(changedBlog)
            .expect(400)

        console.log(res.body)
    })
    it('shouldn\'t delete | no matching id', async () => {
        //setBlogsDB()

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/11a1b1de1111111e11e11b11')
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(404)

        console.log(res.body)
    })
    it('shouldn\'t delete | unauthorized', async () => {
        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + `/${ids.items[0].id.toString()}`)
            .expect(401)

        console.log(res.body)
    })
    it('should delete', async () => {
        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + `/${ids.items[1].id.toString()}`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(204)

        console.log(res.body)
    })
    it('should create blogs post valid authorized', async () => {
        const blog = await createBlogAndPost()

        const res = await req
            .post(SETTINGS.PATH.BLOGS + `/${blog.blogId}/posts`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(postValid(blog.blogId))
            .expect(201)

        console.log(res.body)
    })
    it('should create blogs post valid authorized', async () => {
        const blog = await createBlogAndPost()

        const res = await req
            .post(SETTINGS.PATH.BLOGS + `/${blog.blogId}/posts`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(postValid(blog.blogId))
            .expect(201)

        console.log(res.body)
    })
    it('should not create blogs post valid unauthorized', async () => {
        const blog = await createBlogAndPost()

        const res = await req
            .post(SETTINGS.PATH.BLOGS + `/${blog.blogId}/posts`)
            .send(postValid(blog.blogId))
            .expect(401)

        console.log(res.body)
    })
    it('should not create blogs post invalid authorized', async () => {
        const blog = await createBlogAndPost()

        const newPost: PostInputModel = {
            title: 'blogs post title 11111111111111111111111111111111111111111111111111111111',
            shortDescription: 'blogs post short description',
            content: 'blogs post content',
            blogId: `${blog.blogId}`
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS + `/${blog.blogId}/posts`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(400)

        console.log(res.body)
    })
    it('should get blogs posts authorized', async () => {
        const ids = await blogsQueryRepository.getAllBlogs(1, 10, 'name', 'asc', 'str')

        const res = await req
            .get(SETTINGS.PATH.BLOGS + `/${ids.items[0].id.toString()}/posts`)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .expect(200)

        console.log(res.body)
    })
})