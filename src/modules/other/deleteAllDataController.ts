import { Request, Response } from "express"
import { videosCollection, blogsCollection, postsCollection } from "../../db/mongoDb"

export const deleteAllDataController = async (req: Request, res: Response<any>) => {
  await videosCollection.deleteMany()
  await blogsCollection.deleteMany()
  await postsCollection.deleteMany()
  res.sendStatus(204)
}