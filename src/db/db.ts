import {VideoDBType} from './video-db'
import {BlogDBType} from './blog-db'

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: VideoDBType[],
    blogs: BlogDBType[]
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
    videos: [],
    blogs: [],
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        db.videos = []
        db.blogs = []
        return
    }

    // если что-то передано - то заменяем старые значения новыми
    db.videos = dataset.videos || db.videos
    db.blogs = dataset.blogs || db.blogs
    // db.some = dataset.some || db.some
}