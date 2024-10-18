import { Request, Response } from "express"
import { setDB } from '../../db/db'

export const deleteAllDataController = (req: Request, res: Response<any>) => {
  setDB();
  res.status(204).json({})
}