import { DBType } from '../src/db/localDb'
import { BlogModel } from '../src/db/blog-db'
import { PostModel } from '../src/db/post-db'
import { SETTINGS } from '../src/settings'
import { fromUTF8ToBase64 } from '../src/global-middlewares/adminAuthorizationMiddleware'

// готовые данные для переиспользования в тестах
export const blogValid: BlogModel = {
    id: '12345',
    name: 'valid name',
    description: 'valid description',
    websiteUrl: 'https://validurl.com',
    createdAt: '12.12.12',
    isMembership: false
}

export const blogInvalid: BlogModel = {
    id: '123456',
    name: 'invalid blog name 15+ symbols',
    description: 'valid description',
    websiteUrl: 'https://неверный урл.com',
    createdAt: '12.12.12',
    isMembership: false
}
export const postValid: PostModel = {
    id: '1234567',
    title: 'valid title',
    shortDescription: 'valid short description',
    content: 'valid content',
    blogId: '12345',
    blogName: 'valid name',
    createdAt: '12.12.12'
}

export const postInvalid: PostModel = {
    id: '12345678',
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