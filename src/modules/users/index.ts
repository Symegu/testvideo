import { Router } from "express"
import { AdminAuthorizationMiddleware } from '../../globalMiddlewares/adminAuthorizationMiddleware'
import { emailValidator, loginValidator, passwordValidator } from "./middlewares/userValidators"
import { ErrorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { container } from "../other/composition-root"
import { UsersController } from "./usersController"


const usersController = container.get(UsersController)
const adminAuthorizationMiddleware = container.get(AdminAuthorizationMiddleware)
const errorResultMiddleware = container.get(ErrorResultMiddleware)

export const usersRouter = Router()

usersRouter.get('/',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  usersController.getUsers.bind(usersController))
usersRouter.post('/',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  loginValidator,
  passwordValidator,
  emailValidator,
  errorResultMiddleware.errorResultMiddleware,
  usersController.createUser.bind(usersController))
usersRouter.delete('/:id',
  adminAuthorizationMiddleware.adminAuthorizationMiddleware,
  errorResultMiddleware.errorResultMiddleware,
  usersController.deleteUser.bind(usersController))