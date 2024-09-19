import {req} from "./test-helpers";
import {SETTINGS} from "../src/settings";

describe('/testing/all-data', () => {
    // beforeAll(async () => { // очистка базы данных перед началом тестирования
    //     setDB()
    // })

    it('delete', async () => {
        const res = await req
            .delete(SETTINGS.PATH.TESTING)
            .expect(204)

        console.log(res.status)
        console.log(res.body)
    })
})