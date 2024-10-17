import { VideoDBType } from '../src/db/video-db'
import { Resolutions } from '../src/input-output-types/video-types'
import { DBType } from '../src/db/db'
import { BlogDBType } from '../src/db/blog-db'

// готовые данные для переиспользования в тестах

export const video1: VideoDBType = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [Resolutions.P240],
}
export const video2: VideoDBType = {
    id: 1234,
    title: 't' + Date.now() + Math.random(),
    author: 'a' + Date.now() + Math.random(),
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: '01.01.01',
    availableResolutions: [Resolutions.P240],
}

export const blogValid: BlogDBType = {
    id: 'valid id',
    name: 'valid name',
    description: 'valid description',
    websiteUrl: 'https://validurl.com'
}

export const blogInvalid: BlogDBType = {
    id: 'valid id',
    name: 'invalid blog name 15+ symbols',
    description: 'valid description',
    websiteUrl: 'https://неверный урл.com'
}
// ...

export const dataset1: DBType = {
    videos: [video1, video2],
    blogs: [blogValid, blogInvalid]
    posts: [postValid, postInvalid]
}

// ...