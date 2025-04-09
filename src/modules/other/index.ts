import { Router } from 'express'
import { DeleteAllDataController } from './deleteAllDataController'
import { container } from './composition-root'

const deleteAllDataController = container.get(DeleteAllDataController)
export const testingRouter = Router()

testingRouter.delete('/', deleteAllDataController.deleteAllData.bind(deleteAllDataController))

