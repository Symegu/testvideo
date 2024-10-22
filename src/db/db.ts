import { VideoDBType } from './video-db'
import { BlogDBType } from './blog-db'
import { PostDBType } from './post-db'
// import { MongoClient } from 'mongodb'

// const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017"
// export const client = new MongoClient(mongoUri)

// export async function runDB() {
//     try {
//         await client.connect();
//         await client.db("blogs").command({ ping: 1 })
//         console.log("Connected successfully to mongo server");

//     } catch {
//         console.log("Connection failed to mongo server");
//         await client.close()
//     }
// }
export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: VideoDBType[],
    blogs: BlogDBType[],
    posts: PostDBType[]
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
    videos: [],
    blogs: [],
    posts: []
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        db.videos = []
        db.blogs = []
        db.posts = []
        return
    }

    // если что-то передано - то заменяем старые значения новыми
    db.videos = dataset.videos || db.videos
    db.blogs = dataset.blogs || db.blogs
    db.posts = dataset.posts || db.posts
    // db.some = dataset.some || db.some
}