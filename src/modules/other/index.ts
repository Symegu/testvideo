import { Router } from 'express'
import { deleteAllDataController } from './deleteAllDataController'

export const testingRouter = Router()

testingRouter.delete('/', deleteAllDataController)
