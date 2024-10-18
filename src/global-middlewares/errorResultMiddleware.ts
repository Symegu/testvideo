import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FieldNamesType, OutputErrorsType } from "../input-output-types/output-errors-type";

export const errorResultMiddleware = (req: Request, res: Response<OutputErrorsType>, next: NextFunction) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    const errorsArr = errors.array({onlyFirstError: true}) as { path: FieldNamesType, msg: string }[]
    res.status(400).json({errorsMessages: errorsArr.map(e => ({field: e.path, message: e.msg}))})
  }
  next()
}