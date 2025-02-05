import { Router } from "express"
import { usersController } from "./usersController"
import { adminAuthorizationMiddleware } from '../../globalMiddlewares/adminAuthorizationMiddleware';
import { emailValidator, loginValidator, passwordValidator } from "./middlewares/userValidators";
import { errorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware";

export const usersRouter = Router()

usersRouter.get('/',
  adminAuthorizationMiddleware,
  errorResultMiddleware,
  usersController.getUsers)
usersRouter.post('/',
  adminAuthorizationMiddleware,
  loginValidator,
  passwordValidator,
  emailValidator,
  errorResultMiddleware,
  usersController.createUser)
usersRouter.delete('/:id',
  adminAuthorizationMiddleware,
  errorResultMiddleware,
  usersController.deleteUser)