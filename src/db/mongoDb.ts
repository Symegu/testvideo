import { SETTINGS } from "../settings"
import { Collection, MongoClient } from 'mongodb'
import { BlogModel } from "../types/db-types/blog-db"
import { PostModel } from "../types/db-types/post-db"
import { UserModel } from "../types/db-types/user-db"
import { CommentModel } from "../types/db-types/comment-db"
import { RefreshTokenModel } from "../types/db-types/token-db"
import mongoose from "mongoose"

//const uri = "mongodb+srv://symegu:admin@lessons.ri9n5.mongodb.net/?retryWrites=true&w=majority&appName=Lessons";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export let blogsCollection: Collection<BlogModel>
export let postsCollection: Collection<PostModel>
export let usersCollection: Collection<UserModel>
export let commentsCollection: Collection<CommentModel>
export let tokensCollection: Collection<RefreshTokenModel>

export async function runDB(url: string, testDb?: boolean) { //: Promise<{ client: MongoClient, status?: boolean } | null>
    const client = new MongoClient(url)
    let db = client.db(testDb ? 'Testing' : SETTINGS.DB_NAME)
    //console.log('db name', db.namespace)

    // blogsCollection = db.collection<BlogModel>(SETTINGS.PATH.BLOGS)
    usersCollection = db.collection<UserModel>(SETTINGS.PATH.USERS)
    // postsCollection = db.collection<PostModel>(SETTINGS.PATH.POSTS)
    // commentsCollection = db.collection<CommentModel>(SETTINGS.PATH.COMMENTS)
    tokensCollection = db.collection<RefreshTokenModel>(SETTINGS.PATH.AUTH)
    const blogSchema = new mongoose.Schema<BlogModel>({
        name: { type: String, required: true },
        description: { type: String, required: true },
        websiteUrl: { type: String, required: true },
        createdAt: Date,
        isMembership: { type: Boolean, default: false }
    })

    const postSchema = new mongoose.Schema<PostModel>({
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        content: { type: String, required: true },
        blogId: String,
        blogName: String,
        createdAt: Date
    })

    const commentSchema = new mongoose.Schema<CommentModel>({
        content: { type: String, required: true },
        commentatorInfo: {
            userId: { type: String, required: true },
            userLogin: { type: String, required: true },
        },
        postId: { type: String, required: true },
        createdAt: Date
    })

    // const userSchema = new mongoose.Schema<UserModel>({
    //     login: { type: String, required: true },
    //     email: { type: String, required: true },
    //     password: { type: String, required: true },
    //     createdAt: Date,
    //     emailConfirmation: {
    //         confirmationCode: String,
    //         expirationDate: String,
    //         status: Number
    //     }
    // })

    // const tokenSchema = new mongoose.Schema<RefreshTokenModel>({
    //     ip: String,
    //     title: String,
    //     lastActiveDate: String,
    //     expirationDate: String,
    //     deviceId: String,
    //     userId: String
    // })

    const blogModel = mongoose.model('blogs', blogSchema)
    const postModel = mongoose.model('posts', postSchema)
    const commentModel = mongoose.model('comments', commentSchema)
    // const userModel = mongoose.model('users', userSchema)
    // const tokenModel = mongoose.model('tokens', tokenSchema)

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect()
        await mongoose.connect(url + "/" + testDb ? 'Testing' : SETTINGS.DB_NAME)
        // Send a ping to confirm a successful connection
        await db.command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
        return { client }
    } catch (e) {
        // Ensures that the client will close when you finish/error
        console.log(e);
        await mongoose.disconnect()
        await client.close()
        return null
    }
}
