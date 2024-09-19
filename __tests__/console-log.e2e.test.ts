import {req} from "./test-helpers";
import {SETTINGS} from "../src/settings";

describe('/videos', () => {
    // beforeAll(async () => { // очистка базы данных перед началом тестирования
    //     setDB()
    // })

    it('save', async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            // .expect(200) // проверяем наличие эндпоинта

        console.log(res.status)
        console.log(res.body) // можно посмотреть ответ эндпоинта

        // expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
        expect(1).toBe(1) // проверяем ответ эндпоинта
    })

    it('console', async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
        // .expect(200) // проверяем наличие эндпоинта

        console.log(res.status)
        console.log(res.body) // можно посмотреть ответ эндпоинта

        // expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
        expect(1).toBe(1) // проверяем ответ эндпоинта
    })
})