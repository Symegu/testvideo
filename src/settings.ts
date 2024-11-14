import * as dotenv from 'dotenv'
dotenv.config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    PATH: {
        POSTS: '/posts',
        BLOGS: '/blogs',
        TESTING: '/testing/all-data'
    },
    CREDENTIALS: {
        LOGIN: 'admin',
        PASSWORD: 'qwerty'
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017', 
    DB_NAME: process.env.DB_NAME || ''
}
