
import { SETTINGS } from '../src/settings'
import { fromUTF8ToBase64 } from '../src/globalMiddlewares/adminAuthorizationMiddleware'
import { req } from './test-helpers'


// готовые данные для переиспользования в тестах
export const blogValid = () => ({
  name: 'valid string',
  description: 'valid description',
  websiteUrl: 'https://validurl@mail.com'
})

export const postValid = (blogId: string) => ({
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: blogId
})

export const commentValid = () => ({
  content: 'valid comment content'
})

export const userValid = () => ({
  login: 'masterUser',
  password: 'password',
  email: 'email@mail.com'
})

export const loginValid = () => ({
  loginOrEmail: 'masterUser',
  password: 'password'
})

export const codedAuth = fromUTF8ToBase64(`${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`)

export const createUserFromAdmin = async () => {
  const user = await req
    .post(SETTINGS.PATH.AUTH + '/registration')
    .set({ 'Authorization': 'Basic ' + codedAuth })
    .send(userValid())
  const token = await req
    .post(SETTINGS.PATH.AUTH + '/login')
    .set({ 'Authorization': 'Basic ' + codedAuth })
    .send(loginValid())
  const refreshToken = token.headers['set-cookie']
  console.log('createUserFromAdmin token', token.body.accessToken);

  return {
    user: user,
    token: token.body.accessToken,
    refreshToken: refreshToken
  }
}

export const createBlog = async () => {
  const blog = await req
    .post(SETTINGS.PATH.BLOGS)
    .set({ 'Authorization': 'Basic ' + codedAuth })
    .send(blogValid())

  return {
    blog: blog,
    blogId: blog.body.id.toString()
  }
}

export const createBlogAndPost = async () => {
  const blog = await req
    .post(SETTINGS.PATH.BLOGS)
    .set({ 'Authorization': 'Basic ' + codedAuth })
    .send(blogValid())
  const post = await req
    .post(SETTINGS.PATH.POSTS)
    .set({ 'Authorization': 'Basic ' + codedAuth })
    .send(postValid(blog.body.id.toString()))

  return {
    blogId: blog.body.id.toString(),
    postId: post.body.id.toString()
  }
}

export const createBlogPostComment = async () => {
  const user = await createUserFromAdmin()
  const post = await createBlogAndPost()
  const comment = await req
    .post(SETTINGS.PATH.POSTS + `/${post.postId.toString()}/comments`)
    .set({ 'Authorization': 'Bearer ' + user.token.toString() })
    .send(commentValid())
  return {
    user: user,
    token: user.token,
    refreshToken: user.refreshToken,
    blogId: post.blogId,
    postId: post.postId,
    comment: comment.body.id
  }
}

