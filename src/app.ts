import express from 'express'
import cors from 'cors'
import { SETTINGS } from './settings'
import { blogsRouter } from './modules/blogs'
import { postsRouter } from './modules/posts'
import { authRouter, testingRouter } from './modules/other'
import { usersRouter } from './modules/users'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.0' })
})



app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)