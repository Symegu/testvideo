import { Request, Response } from "express"
import { blogsCollection, postsCollection, usersCollection } from "../../db/mongoDb"

export const deleteAllDataController = async (req: Request, res: Response<any>) => {
  await blogsCollection.deleteMany()
  await postsCollection.deleteMany()
  await usersCollection.deleteMany()
  res.sendStatus(204)
}