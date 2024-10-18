// import { req } from './test-helpers'
// import { setDB } from '../src/db/db'
// import { dataset1, video1 } from './datasets'
// import { SETTINGS } from '../src/settings'
// import { InputChangeVideoType, InputVideoType, Resolutions } from '../src/input-output-types/video-types'

// describe('/videos', () => {
//     beforeAll(async () => { // очистка базы данных перед началом тестирования
//         setDB()
//     })

//     it('should get empty array', async () => {
//         // setDB() // очистка базы данных если нужно

//         const res = await req
//             .get(SETTINGS.PATH.VIDEOS)
//             .expect(200) // проверяем наличие эндпоинта

//         console.log(res.body) // можно посмотреть ответ эндпоинта

//         expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
//     })
//     it('should get not empty array', async () => {
//         setDB(dataset1) // заполнение базы данных начальными данными если нужно

//         const res = await req
//             .get(SETTINGS.PATH.VIDEOS)
//             .expect(200)

//         console.log(res.body)

//         expect(res.body.length).toBe(2)
//         expect(res.body[0]).toEqual(dataset1.videos[0])
//     })
//     it('should create', async () => {
//         setDB()
//         const newVideo: InputVideoType = {
//             title: 't1',
//             author: 'a1',
//             availableResolutions: [Resolutions.P144]
//             // ...
//         }

//         const res = await req
//             .post(SETTINGS.PATH.VIDEOS)
//             .send(newVideo) // отправка данных
//             .expect(201)

//         console.log(res.body)

//         expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions)
//     })
//     it('shouldn\'t create', async () => {
//         setDB()
//         const newVideo: InputVideoType = {
//             title: '',
//             author: 'a1',
//             availableResolutions: [Resolutions.P144]
//             // ...
//         }

//         const res = await req
//             .post(SETTINGS.PATH.VIDEOS)
//             .send(newVideo) // отправка данных
//             .expect(400)

//         console.log(res.body)
//     })
//     it('shouldn\'t create', async () => {
//         setDB()
//         const newVideo: InputVideoType = {
//             title: 't1',
//             author: '',
//             availableResolutions: [Resolutions.P144]
//             // ...
//         }

//         const res = await req
//             .post(SETTINGS.PATH.VIDEOS)
//             .send(newVideo) // отправка данных
//             .expect(400)

//         console.log(res.body)
//     })
//     it('shouldn\'t find', async () => {
//         setDB(dataset1)

//         const res = await req
//             .get(SETTINGS.PATH.VIDEOS + '/1')
//             .expect(404) // проверка на ошибку

//         console.log(res.body)
//     })
//     it('should find', async () => {
//         setDB(dataset1)

//         const res = await req
//             .get(SETTINGS.PATH.VIDEOS + '/1234')
//             .expect(200) // проверка на ошибку

//         console.log(res.body)
//     })
//     it('shouldn\'t delete', async () => {
//         setDB(dataset1)

//         const res = await req
//             .delete(SETTINGS.PATH.VIDEOS + '/1')
//             .expect(404) // проверка на ошибку

//         console.log(res.body)
//     })
//     it('should delete', async () => {
//         setDB(dataset1)

//         const res = await req
//             .delete(SETTINGS.PATH.VIDEOS + '/1234')
//             .expect(204) // проверка на ошибку

//         console.log(res.body)
//     })
//     it('should change', async () => {
//         setDB(dataset1)
//         const updatedVideo: InputChangeVideoType = {
//             title: 't1',
//             author: 'a2',
//             availableResolutions: [Resolutions.P144],
//             canBeDownloaded: true,
//             minAgeRestriction: 18,
//             publicationDate: '01.01.01'
//         }
//         const res = await req
//             .put(SETTINGS.PATH.VIDEOS + '/1234')
//             .send(updatedVideo)
//             .expect(204) // проверка на ошибку

//         console.log(res.body)
//     })
//     it('shouldn\'t change', async () => {
//         setDB(dataset1)
//         const updatedVideo: InputChangeVideoType = {
//             title: '',
//             author: 'a2',
//             availableResolutions: [Resolutions.P144],
//             canBeDownloaded: true,
//             minAgeRestriction: 18,
//             publicationDate: '01.01.01'
//         }
//         const res = await req
//             .put(SETTINGS.PATH.VIDEOS + '/1234')
//             .send(updatedVideo)
//             .expect(400) // проверка на ошибку

//         console.log(res.body)
//     })

//     it('shouldn\'t change', async () => {
//         setDB(dataset1)
//         const updatedVideo: InputChangeVideoType = {
//             title: 't1',
//             author: '',
//             availableResolutions: [Resolutions.P144],
//             canBeDownloaded: true,
//             minAgeRestriction: 18,
//             publicationDate: '21.01.01'
//         }
//         const res = await req
//             .put(SETTINGS.PATH.VIDEOS + '/1234')
//             .send(updatedVideo)
//             .expect(400) // проверка на ошибку

//         console.log(res.body)
//     })

//     it('shouldn\'t change', async () => {
//         setDB(dataset1)
//         const updatedVideo: InputChangeVideoType = {
//             title: 't1',
//             author: 'a2',
//             availableResolutions: [Resolutions.P1080],
//             canBeDownloaded: false,
//             minAgeRestriction: 0,
//             publicationDate: '231213'
//         }
//         const res = await req
//             .put(SETTINGS.PATH.VIDEOS + '/1234')
//             .send(updatedVideo)
//             .expect(400) // проверка на ошибку

//         console.log(res.body)
//     })
// })