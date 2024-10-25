import { Request, Response } from "express"
import { setDB } from '../../db/localDb'

export const deleteAllDataController = (req: Request, res: Response<any>) => {
  setDB();
  res.sendStatus(204)
}