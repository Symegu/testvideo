import { config } from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3004,
    PATH: {
        VIDEOS: '/videos',
        POSTS: '/posts',
        BLOGS: '/blogs',
        TESTING: '/testing/all-data'
    },
    CREDENTIALS: {
        LOGIN: 'admin',
        PASSWORD: 'qwerty'
    }
}
