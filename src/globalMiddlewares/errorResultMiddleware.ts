import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FieldNamesType, OutputErrorsType } from "../types/input-output-types/output-errors-type";

export const errorResultMiddleware = async (req: Request, res: Response<OutputErrorsType>, next: NextFunction) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    const errorsArr = errors.array({onlyFirstError: true}) as { path: FieldNamesType, msg: string }[]
    console.error('Validation errors:', errorsArr)
    res.status(400).json({errorsMessages: errorsArr.map(e => ({message: e.msg, field: e.path}))})
    return
  } 
  next()
  
}