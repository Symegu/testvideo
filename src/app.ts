import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import "reflect-metadata"
import { SETTINGS } from './settings'
import { blogsRouter } from './modules/blogs'
import { postsRouter } from './modules/posts'
import { testingRouter } from './modules/other'
import { usersRouter } from './modules/users'
import { authRouter } from './modules/auth'
import { commentsRouter } from './modules/comments'
import { securityRouter } from './modules/security'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body во всех реквестах
app.use(cookieParser())
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк
app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.0' })
})


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.SECURITY, securityRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)

