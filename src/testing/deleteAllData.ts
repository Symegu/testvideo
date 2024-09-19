import {Request, Response} from "express"
import {db} from '../db/db'

export const deleteAllData = (req: Request, res: Response<any>) => {
  db.videos = []
  res.sendStatus(204)
}