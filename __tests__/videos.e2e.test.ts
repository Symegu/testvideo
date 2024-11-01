import { req } from './test-helpers'
import { setVideosDB } from '../src/db/localDb'
import { SETTINGS } from '../src/settings'
import { InputChangeVideoType, InputVideoType, Resolutions } from '../src/input-output-types/video-types'
import { runDB, videosCollection } from '../src/db/mongoDb'
import { MongoClient } from 'mongodb'

let client: MongoClient

describe('/videos', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        const result = await runDB(SETTINGS.MONGO_URL, true);
        if (result) {
            client = result.client
            await videosCollection.deleteMany({})
        } else {
            throw new Error("Unable to connect to the database")
        }
        // await runDB(SETTINGS.MONGO_URL, true)
        // await videosCollection.drop()
    })
    afterAll(async () => {
        await client.close() // Закрываем сервер после тестов
    });
    it('should get empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        await setVideosDB() // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toBe(2)
    })
    it('should create', async () => {
        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
            // ...
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(201)

        console.log(res.body)

        expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions)
    })
    it('shouldn\'t create', async () => {
        const newVideo: InputVideoType = {
            title: '',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
            // ...
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(400)

        console.log(res.body)
    })
    it('shouldn\'t create', async () => {
        const newVideo: InputVideoType = {
            title: 't1',
            author: '',
            availableResolutions: [Resolutions.P144]
            // ...
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(400)

        console.log(res.body)
    })
    // it('shouldn\'t find', async () => {
    //     const res = await req
    //         .get(SETTINGS.PATH.VIDEOS + '/0')
    //         .expect(404) 

    //     console.log(res.body)
    // })
    it('should find', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/1234')
            .expect(200) 

        console.log(res.body)
    })
    it('should change', async () => {
       await setVideosDB()
        const updatedVideo: InputChangeVideoType = {
            title: 't1',
            author: 'a2',
            availableResolutions: [Resolutions.P144],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '01.01.01'
        }
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + '/1234')
            .send(updatedVideo)
            .expect(204) 

        console.log(res.body)
    })
    it('shouldn\'t change', async () => {
       await setVideosDB()
        const updatedVideo: InputChangeVideoType = {
            title: '',
            author: 'a2',
            availableResolutions: [Resolutions.P144],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '01.01.01'
        }
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + '/1234')
            .send(updatedVideo)
            .expect(400) 

        console.log(res.body)
    })

    it('shouldn\'t change', async () => {
       await setVideosDB()
        const updatedVideo: InputChangeVideoType = {
            title: 't1',
            author: '',
            availableResolutions: [Resolutions.P144],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '21.01.01'
        }
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + '/1234')
            .send(updatedVideo)
            .expect(400) 

        console.log(res.body)
    })

    it('shouldn\'t change', async () => {
       await setVideosDB()
        const updatedVideo: InputChangeVideoType = {
            title: 't1',
            author: 'a2',
            availableResolutions: [Resolutions.P1080],
            canBeDownloaded: false,
            minAgeRestriction: 0,
            publicationDate: '231213'
        }
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + '/1234')
            .send(updatedVideo)
            .expect(400) 

        console.log(res.body)
    })

    it('shouldn\'t delete', async () => {
        const res = await req
            .delete(SETTINGS.PATH.VIDEOS + '/0')
            .expect(404) 

        console.log(res.body)
    })
    it('should delete', async () => {
        const res = await req
            .delete(SETTINGS.PATH.VIDEOS + '/1234')
            .expect(204) 

        console.log(res.body)
    })
})