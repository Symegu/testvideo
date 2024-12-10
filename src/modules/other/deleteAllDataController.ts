import { Request, Response } from "express"
import { blogsCollection, postsCollection, tokensCollection, usersCollection } from "../../db/mongoDb"

export const deleteAllDataController = async (req: Request, res: Response<any>) => {
  await blogsCollection.deleteMany()
  await postsCollection.deleteMany()
  await usersCollection.deleteMany()
  await tokensCollection.deleteMany()
  res.sendStatus(204)
}