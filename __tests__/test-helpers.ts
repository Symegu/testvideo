import { app } from '../src/app'
import { agent } from 'supertest'
import { runDB, UserModelClass } from '../src/db/mongoDb'

export const req = agent(app)

export const setupDb = async () => {
  const result = await runDB(process.env.MONGO_URL || 'mongodb://localhost:27017')
  if (!result) throw new Error("Unable to connect to the database")
  await UserModelClass.deleteMany({})
}

export const teardownDb = async () => {
  await UserModelClass.deleteMany({})
}
