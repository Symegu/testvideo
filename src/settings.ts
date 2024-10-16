import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    PATH: {
        VIDEOS: '/videos',
        POSTS: '/posts',
        BLOGS: '/blogs',
        TESTING: '/testing/all-data'
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
}

// const x = SETTINGS.PATH.VIDEO