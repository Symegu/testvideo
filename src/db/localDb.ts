import { BlogModel } from '../types/db-types/blog-db'
import { PostModel } from '../types/db-types/post-db'
import { blogsCollection, postsCollection } from './mongoDb'
import { blogInvalid, blogValid, postInvalid, postValid } from '../../__tests__/datasets';

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    blogs: BlogModel[],
    posts: PostModel[]
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
    blogs: [],
    posts: []
}

// функция для быстрой очистки/заполнения базы данных для тестов
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