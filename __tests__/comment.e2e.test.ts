import { MongoClient } from "mongodb"
import { runDB, CommentModelClass, BlogModelClass, PostModelClass } from "../src/db/mongoDb"
import { SETTINGS } from "../src/settings"
import { createBlogPostComment } from "./datasets"
import { req } from "./test-helpers"

let client: MongoClient
describe('/comments', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    const result = await runDB(SETTINGS.MONGO_URL);
    if (result) {
      await CommentModelClass.deleteMany({})
      await PostModelClass.deleteMany({})
      await BlogModelClass.deleteMany({})
    } else {
      throw new Error("Unable to connect to the database")
    }
  })
  afterAll(async () => {
    await BlogModelClass.deleteMany({})
    await PostModelClass.deleteMany({})
    await CommentModelClass.deleteMany({})
  })

  it('should create blog, post for blog, comment for post and find this comment', async () => {
    const comment = await createBlogPostComment()

    const res = await req
      .get(SETTINGS.PATH.COMMENTS + `/${comment.comment}`)
      .expect(200)
    console.log(res.body)
  })

  it('should create blog, post for blog, comment for post and change this comment', async () => {
    const comment = await createBlogPostComment()

    const res = await req
      .put(SETTINGS.PATH.COMMENTS + `/${comment.comment}`)
      .set({ 'Authorization': 'Bearer ' + comment.token })
      .send({ content: 'valid changed content' })
      .expect(204)
    console.log(res.body)
  })

  it('should create blog, post for blog, comment for post and delete this comment', async () => {
    const comment = await createBlogPostComment()

    const res = await req
      .delete(SETTINGS.PATH.COMMENTS + `/${comment.comment}`)
      .set({ 'Authorization': 'Bearer ' + comment.token })
      .expect(204)
    console.log(res.body)
  })
})