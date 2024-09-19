import {Request, Response, Router} from 'express'
import {deleteAllData} from './deleteAllData'

export const testingRouter = Router()

testingRouter.delete('/all-data', deleteAllData)
