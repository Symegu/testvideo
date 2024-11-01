import { VideoDBType } from './video-db'
import { BlogModel } from './blog-db'
import { PostModel } from './post-db'
import { blogsCollection, postsCollection, videosCollection } from './mongoDb'
import { blogInvalid, blogValid, postInvalid, postValid, video1, video2 } from '../../__tests__/datasets';

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: VideoDBType[],
    blogs: BlogModel[],
    posts: PostModel[]
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
    videos: [],
    blogs: [],
    posts: []
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setVideosDB = async (empty?: boolean) => {
    // if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
    //     db.videos = []
    //     db.blogs = []
    //     db.posts = []
    //     return
    // }

    // // если что-то передано - то заменяем старые значения новыми
    // db.videos = dataset.videos || db.videos
    // db.blogs = dataset.blogs || db.blogs
    // db.posts = dataset.posts || db.posts
    // db.some = dataset.some || db.some
    if (empty) {
        await videosCollection.deleteMany()
    }
    await videosCollection.deleteMany()
    await videosCollection.insertMany([{...video1}, {...video2}])
}

export const setBlogsDB = async (empty?: boolean) => {
    if (empty) {
        await blogsCollection.deleteMany()
    }
    await blogsCollection.deleteMany()
    await blogsCollection.insertMany([{...blogValid}, {...blogInvalid}])
}

export const setPostsDB = async (empty?: boolean) => {
    if (empty) {
        await postsCollection.deleteMany()
    }
    await postsCollection.deleteMany()
    await postsCollection.insertMany([{...postValid}, {...postInvalid}])
}