// import { MongoClient } from "mongodb"
// import { runDB, CommentModelClass, BlogModelClass, PostModelClass } from "../src/db/mongoDb"
// import { SETTINGS } from "../src/settings"
// import { createBlogPostComment } from "./datasets"
// import { req } from "./test-helpers"

// let client: MongoClient
// describe('/comments', () => {
//   beforeAll(async () => { // очистка базы данных перед началом тестирования
//     const result = await runDB(SETTINGS.MONGO_URL, true);
//     if (result) {
//       await CommentModelClass.deleteMany({})
//       await PostModelClass.deleteMany({})
//       await BlogModelClass.deleteMany({})
//     } else {
//       throw new Error("Unable to connect to the database")
//     }
//   })
//   afterAll(async () => {
//     await BlogModelClass.deleteMany({})
//     await PostModelClass.deleteMany({})
//     await CommentModelClass.deleteMany({})
//   })

//   it('should create blog, post for blog, comment for post and find this comment', async () => {
//     const comment = await createBlogPostComment()

//     const res = await req
//       .get(SETTINGS.PATH.COMMENTS + `/${comment.comment}`)
//       .expect(200)
//     console.log(res.body)
//   })

//   it('should create blog, post for blog, comment for post and change this comment', async () => {
//     const comment = await createBlogPostComment()

//     const res = await req
//       .put(SETTINGS.PATH.COMMENTS + `/${comment.comment}`)
//       .set({ 'Authorization': 'Bearer ' + comment.token })
//       .send({ content: 'valid changed content' })
//       .expect(204)
//     console.log(res.body)
//   })

//   it('should create blog, post for blog, comment for post and delete this comment', async () => {
//     const comment = await createBlogPostComment()

//     const res = await req
//       .delete(SETTINGS.PATH.COMMENTS + `/${comment.comment}`)
//       .set({ 'Authorization': 'Bearer ' + comment.token })
//       .expect(204)
//     console.log(res.body)
//   })
// })

import request from 'supertest'
import { app } from '../../src/app'
import { runDB } from '../../src/db/mongoDb'
import { HTTP_STATUSES } from '../../src/settings/http_statuses'
import { LikeStatus } from '../../src/types/db-types/comment-db'
import { createUserFromAdmin, createBlogAndPost } from '../helpers/test-helpers'

describe('Comments E2E', () => {
  const agent = request.agent(app)

  let accessToken: string
  let commentId: string
  let postId: string

  beforeAll(async () => {
    await runDB.clearAll()
    const user = await createUserFromAdmin(agent)
    accessToken = user.tokens.accessToken

    const { post } = await createBlogAndPost(agent, accessToken)
    postId = post.id
  })

  it('should create comment', async () => {
    const response = await agent.post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Test comment' })
      .expect(HTTP_STATUSES.CREATED_201)

    commentId = response.body.id
    expect(response.body).toMatchObject({
      content: 'Test comment',
      commentatorInfo: { userLogin: expect.any(String) },
      likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None' },
    })
  })

  it('should get comment by id', async () => {
    const response = await agent.get(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HTTP_STATUSES.OK_200)

    expect(response.body.id).toBe(commentId)
  })

  it('should update comment', async () => {
    await agent.put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Updated comment' })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const updated = await agent.get(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(updated.body.content).toBe('Updated comment')
  })

  it('should like comment', async () => {
    await agent.put(`/comments/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.Like })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const liked = await agent.get(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(liked.body.likesInfo).toEqual({ likesCount: 1, dislikesCount: 0, myStatus: 'Like' })
  })

  it('should switch to dislike', async () => {
    await agent.put(`/comments/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.Dislike })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const disliked = await agent.get(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(disliked.body.likesInfo).toEqual({ likesCount: 0, dislikesCount: 1, myStatus: 'Dislike' })
  })

  it('should remove like status', async () => {
    await agent.put(`/comments/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ likeStatus: LikeStatus.None })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const cleared = await agent.get(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(cleared.body.likesInfo).toEqual({ likesCount: 0, dislikesCount: 0, myStatus: 'None' })
  })

  it('should delete comment', async () => {
    await agent.delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await agent.get(`/comments/${commentId}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })
})
