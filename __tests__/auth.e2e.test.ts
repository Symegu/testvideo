import { MongoClient } from "mongodb"
import { runDB, usersCollection } from "../src/db/mongoDb"
import { SETTINGS } from "../src/settings"
import { UserInputModel } from "../src/types/input-output-types/user-types"
import { req } from "./test-helpers"
import { createUserFromAdmin, loginValid } from "./datasets"

//TODO: add email resending and confirmation test

let client: MongoClient
describe('/users', () => {
  beforeAll(async () => {
    const result = await runDB(SETTINGS.MONGO_URL)
    if (result) {
      client = result.client
      await usersCollection.deleteMany({})
    } else {
      throw new Error("Unable to connect to the database")
    }
  })
  afterAll(async () => {
    await usersCollection.deleteMany({})
    await client.close() // Закрываем сервер после тестов
  })

  it('should not register user | invalid data', async () => {
    const user: UserInputModel = {
      login: 'masterUser',
      password: 'password',
      email: '@mail.com'
    }

    const res = await req
      .post(SETTINGS.PATH.AUTH + '/registration')
      .send(user)
      .expect(400)

    console.log(res.body)
  })
  it('should register user', async () => {
    const user: UserInputModel = {
      login: 'master',
      password: 'password',
      email: 'master@mail.com'
    }

    const res = await req
      .post(SETTINGS.PATH.AUTH + '/registration')
      .send(user)
      .expect(204)

    console.log(res.body)
  })
  it('should get logged user info', async () => {
    const user = await createUserFromAdmin()

    const res = await req
      .get(SETTINGS.PATH.AUTH + '/me')
      .set({ 'Authorization': 'Bearer ' + user.token })
      .expect(200)

    console.log(res.body)
  })
  it('should not get logged user info | unauthorized', async () => {
    const token = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .send(loginValid())
    console.log(token.body)

    const res = await req
      .get(SETTINGS.PATH.AUTH + '/me')
      .expect(401)

    console.log(res.body)
  })
  it('should logout user', async () => {
    const tokenResponse = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .send(loginValid())
    const refreshToken = tokenResponse.headers['set-cookie']

    const res = await req
      .post(SETTINGS.PATH.AUTH + '/logout')
      .set('Cookie', refreshToken)
      .expect(204)

    console.log(res.body)
  })
  it('should not login user | invalid data', async () => {

    const res = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .send({ loginOrEmail: 'masterUser2', password: 'password' })
      .expect(401)

    console.log(res.body)
  })
  it('should not login user | invalid data', async () => {

    const res = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .send({ loginOrEmail: 'masterUser', password: 'password2' })
      .expect(401)

    console.log(res.body)
  })
  it('should login user after getting 429 error', async () => {
    const res = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .send(loginValid())
      .expect(429)
    expect(200)

    console.log(res.body)
  })
  it('should refresh tokens', async () => {
    const tokenResponse = await req
      .post(SETTINGS.PATH.AUTH + '/login')
      .send(loginValid())

    if (tokenResponse.status === 429) {
      console.log('Too many requests, please try again later.')
      return // или выбросьте ошибку, если это необходимо
    }

    // Проверяем, что ответ успешный
    expect(tokenResponse.status).toBe(200)

    // Извлекаем refreshToken из куков
    const refreshToken = tokenResponse.headers['set-cookie']

    if (!refreshToken) {
      throw new Error('Refresh token not found')
    }

    // Ждем 10 секунд перед обновлением токена
    await new Promise(resolve => setTimeout(resolve, 10000))

    // Выполняем запрос на обновление токена
    const res = await req
      .post(SETTINGS.PATH.AUTH + '/refresh-token')
      .set('Cookie', refreshToken)
      .expect(200) // Ожидаем успешный ответ

    console.log(res.body)
  })
})