import { body } from "express-validator"
import { UserModelClass } from "../../../db/mongoDb"

export async function checkUnique(loginOrEmail: string): Promise<boolean>{
  const res = await UserModelClass.findOne(
    {$or: [
      {login: loginOrEmail},
      {email: loginOrEmail}
    ]}
  )

  return !!res
}

export const loginValidator = body('login')
  .trim()
  .isString()
  .withMessage('login is not string')
  .isLength({ min: 3, max: 10 })
  .withMessage('login length is more than 10 or less than 3')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('login does not match required pattern')
  .custom(async (login) => {
    const isUnique = await checkUnique(login)
    if (isUnique) {
        throw new Error('login must be unique')
    }
    return true
  })

export const passwordValidator = body('password')
  .trim()
  .isString()
  .withMessage('password is not string')
  .isLength({ min: 6, max: 20 })
  .withMessage('password length is more than 20 or less than 6')

export const newPasswordValidator = body('newPassword')
  .trim()
  .isString()
  .withMessage('password is not string')
  .isLength({ min: 6, max: 20 })
  .withMessage('password length is more than 20 or less than 6')

export const emailValidator = body('email')
  .trim()
  .isString()
  .withMessage('email is not string')
  .isLength({ min: 1 })
  .withMessage('email length is less than 1')
  .isEmail()
  .withMessage('email does not match required pattern')
  // .matches(/^[a-zA-Z0-9_-]*$/)
  // .withMessage('email does not match required pattern')
  .custom(async (value) => {
    const isUnique = await checkUnique(value)
    if (isUnique) {
        throw new Error('email must be unique')
    }
    return true
  })

export const simpleEmailValidator = body('email')
  .trim()
  .isString()
  .withMessage('email is not string')
  .isLength({ min: 1 })
  .withMessage('email length is less than 1')
  .isEmail()
  .withMessage('email does not match required pattern')

export const authValidator = body('loginOrEmail')
  .trim()
  .isString()
  .withMessage('login or email is not string')