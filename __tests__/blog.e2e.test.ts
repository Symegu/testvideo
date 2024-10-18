import { req } from './test-helpers'
import { setDB } from '../src/db/db'
import { codedAuth, dataset1 } from './datasets'
import { SETTINGS } from '../src/settings'
import { BlogInputType } from '../src/input-output-types/blog-types'

describe('/blogs', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB()
    })

    it('should get empty array', async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toBe(2)
        expect(res.body[0]).toEqual(dataset1.blogs[0])
    })
    it('should create', async () => {
      setDB()
      const newBlog: BlogInputType = {
          "name": "string",
          "description": "string",
          "websiteUrl": "https://qwerty.com"
      }

      const res = await req
          .post(SETTINGS.PATH.BLOGS)
          .set({'Authorization': 'Basic ' + codedAuth})
          .send(newBlog) // отправка данных
          .expect(201)

      console.log(res.body)
  })
    it('shouldn\'t create | valid but unauthorized', async () => {
        setDB()
        const newBlog: BlogInputType = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://qwerty.com"
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(401)

        console.log(res.body)
    })
    it('shouldn\'t create | valid but authorize invalid', async () => {
      setDB()
      const newBlog: BlogInputType = {
          "name": "string",
          "description": "string",
          "websiteUrl": "https://qwerty.com"
      }

      const res = await req
          .post(SETTINGS.PATH.BLOGS)
          .set({'Authorization': 'Bearer ' + codedAuth})
          .send(newBlog) // отправка данных
          .expect(401)

      console.log(res.body)
    })

    it('shouldn\'t create | invalid data', async () => {
      setDB()
      const newBlog: BlogInputType = {
          "name": "string 1234567890",
          "description": "string",
          "websiteUrl": "https://qwerty.com"
      }

      const res = await req
          .post(SETTINGS.PATH.BLOGS)
          .set({'Authorization': 'Basic ' + codedAuth})
          .send(newBlog) // отправка данных
          .expect(400)

      console.log(res.body)
    })

    it('shouldn\'t create | invalid data', async () => {
      setDB()
      const newBlog: BlogInputType = {
          "name": "string",
          "description": "string",
          "websiteUrl": "https://XyIO0OXFjEfAOnMi55eLn8uhl-g4cZL8v5Tig0.2N8uTKO1j4dUy.YSCL29YpVYfww_slzGgbYt6ewj7cYzV.V9wrDiM.commmmm54754567467547564756"
      }

      const res = await req
          .post(SETTINGS.PATH.BLOGS)
          .set({'Authorization': 'Basic ' + codedAuth})
          .send(newBlog) // отправка данных
          .expect(400)

      console.log(res.body)
    })
    it('shouldn\'t find', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .expect(404)

        console.log(res.body)
    })
    it('should find', async () => {
        setDB(dataset1)
        
        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/12345')
            .expect(200)

        console.log(res.body)
    })
    it('shouldn\'t delete | no matching id', async () => {
        setDB(dataset1)

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404)

        console.log(res.body)
    })
    it('shouldn\'t delete | unauthorized', async () => {
        setDB(dataset1)

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/12345')
            .expect(401)

        console.log(res.body)
    })
    it('should delete', async () => {
        setDB(dataset1)

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/12345')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204)

        console.log(res.body)
    })
    it('should change', async () => {
        setDB(dataset1)
        const changedBlog: BlogInputType = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://changed-url.com"
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/12345')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(changedBlog)
            .expect(204)

        console.log(res.body)
    })
    it('should\'t change | unauthorized', async () => {
        setDB(dataset1)
        const changedBlog: BlogInputType = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://changed-url.com"
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/12345')
            .send(changedBlog)
            .expect(401)

        console.log(res.body)
    })
    it('should\'t change | invalid data', async () => {
        setDB(dataset1)
        const changedBlog: BlogInputType = {
            "name": "string 1234567890000",
            "description": "string",
            "websiteUrl": "https://changed-url.com"
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/12345')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(changedBlog)
            .expect(400)

        console.log(res.body)
    })
    it('should\'t change | invalid data', async () => {
        setDB(dataset1)
        const changedBlog: BlogInputType = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://changed-url----------------------------------------------.com"
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/12345')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(changedBlog)
            .expect(400)

        console.log(res.body)
    })
})