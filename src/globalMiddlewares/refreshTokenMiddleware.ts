// import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const refreshTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем, есть ли refreshToken в куках
  const refreshToken = req.cookies.refreshToken;

  // Если токен отсутствует, возвращаем ошибку
  if (!refreshToken) {
    res.status(401)
    return
  }

  // (Необязательно) Проверяем формат токена, если у вас есть определенные правила
  // Например, проверка на длину, наличие определенных символов и т.д.
  if (typeof refreshToken !== 'string' || refreshToken.length !== 64) { 
    res.status(400)
    return
  }

  // Если всё в порядке, переходим к следующему middleware
  next()
}