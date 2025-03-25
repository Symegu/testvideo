import { req } from './test-helpers'
import { MongoClient } from "mongodb"
import { runDB, usersCollection } from "../src/db/mongoDb"
import { SETTINGS } from "../src/settings"
import { codedAuth, createUserFromAdmin } from './datasets'
import { UserInputModel } from '../src/types/input-output-types/user-types'
import { UsersQueryRepository } from '../src/modules/users/usersQueryRepository'
import { container } from '../src/modules/other/composition-root'

let client: MongoClient
let usersQueryRepository: UsersQueryRepository
describe('/auth', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    const result = await runDB(SETTINGS.MONGO_URL)
    usersQueryRepository = container.get(UsersQueryRepository)
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

  it('should get empty array', async () => {

    const res = await req
      .get(SETTINGS.PATH.USERS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(201) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

    expect(res.body.items.length).toBe(0) // проверяем ответ эндпоинта
  })
  it('should create user', async () => {

    const user: UserInputModel = {
      login: 'user2',
      password: 'password2',
      email: 'master2@mail.com'
    }

    const res = await req
      .post(SETTINGS.PATH.USERS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .send(user)
      .expect(201)

    console.log(res.body)
  })
  it('should not create user | unauthorized', async () => {

    const user: UserInputModel = {
      login: 'masterUser',
      password: 'password',
      email: 'master@mail.com'
    }

    const res = await req
      .post(SETTINGS.PATH.USERS)
      .send(user)
      .expect(401)

    console.log(res.body)
  })
  it('should get not empty array', async () => {
    await createUserFromAdmin()
    const res = await req
      .get(SETTINGS.PATH.USERS)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(201) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

    expect(res.body.items.length).toBe(2) // проверяем ответ эндпоинта
  })
  it('should not delete user | unauthorized', async () => {
    const ids = await usersQueryRepository.getAllUsers(1, 10, 'name', 'asc', '', '')
    const res = await req
      .delete(SETTINGS.PATH.USERS + `/${ids.items[0].id.toString()}`)
      .expect(401) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

  })
  it('should delete user | no matching user', async () => {
    const res = await req
      .delete(SETTINGS.PATH.USERS + `/11a1b1de1111111e11e11b11`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(404) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

  })
  it('should delete user', async () => {
    const ids = await usersQueryRepository.getAllUsers(1, 10, 'name', 'asc', '', '')
    const res = await req
      .delete(SETTINGS.PATH.USERS + `/${ids.items[0].id.toString()}`)
      .set({ 'Authorization': 'Basic ' + codedAuth })
      .expect(204) // проверяем наличие эндпоинта

    console.log(res.body) // можно посмотреть ответ эндпоинта

  })
})