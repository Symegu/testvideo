import { DBType } from '../src/db/localDb'
import { BlogModel } from '../src/types/db-types/blog-db'
import { PostModel } from '../src/types/db-types/post-db'
import { SETTINGS } from '../src/settings'
import { fromUTF8ToBase64 } from '../src/globalMiddlewares/adminAuthorizationMiddleware'
import { ObjectId } from 'mongodb'

// готовые данные для переиспользования в тестах
export const blogValid: BlogModel = {
    _id: new ObjectId('113456123456123456123455'),
    name: 'valid name',
    description: 'valid description',
    websiteUrl: 'https://validurl.com',
    createdAt: '12.12.12',
    isMembership: false
}

export const blogInvalid: BlogModel = {
    _id: new ObjectId('123456123456123456123456'),
    name: 'invalid blog name 15+ symbols',
    description: 'valid description',
    websiteUrl: 'https://неверный урл.com',
    createdAt: '12.12.12',
    isMembership: false
}
export const postValid: PostModel = {
    _id: new ObjectId('223456123456123456123456'),
    title: 'valid title',
    shortDescription: 'valid short description',
    content: 'valid content',
    blogId: '12345',
    blogName: 'valid name',
    createdAt: '12.12.12'
}

export const postInvalid: PostModel = {
    _id: new ObjectId('423456123456123456123456'),
    title: 'invalid title more than 30 symbols',
    shortDescription: 'valid short description',
    content: 'valid content',
    blogId: '123456',
    blogName: 'invalid blog name',
    createdAt: '12.12.12'
}

export const codedAuth = fromUTF8ToBase64(`${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`)

export const dataset1: DBType = {
    blogs: [blogValid, blogInvalid],
    posts: [postValid, postInvalid],
}

// ...