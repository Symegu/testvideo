import { SETTINGS } from "../settings"
import mongoose from "mongoose"
import { UserModel, ConfirmationStatus } from "../types/db-types/user-db";
import { BlogModel } from "../types/db-types/blog-db";
import { PostModel } from "../types/db-types/post-db";
import { CommentModel } from "../types/db-types/comment-db";
import { RefreshTokenModel } from "../types/db-types/token-db";
import "reflect-metadata"
//const uri = "mongodb+srv://symegu:admin@lessons.ri9n5.mongodb.net/?retryWrites=true&w=majority&appName=Lessons";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const blogSchema = new mongoose.Schema<BlogModel>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isMembership: { type: Boolean, default: false }
})

const postSchema = new mongoose.Schema<PostModel>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const commentSchema = new mongoose.Schema<CommentModel>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const refreshTokenSchema = new mongoose.Schema<RefreshTokenModel>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    deviceId: { type: String, required: true },
    userId: { type: String, required: true }
})

const userSchema = new mongoose.Schema<UserModel>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), required: true },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        status: { type: Number, required: true, enum: ConfirmationStatus }
    }
})

export const BlogModelClass = mongoose.model<BlogModel>("Blog", blogSchema)
export const PostModelClass = mongoose.model<PostModel>("Post", postSchema)
export const CommentModelClass = mongoose.model<CommentModel>("Comment", commentSchema)
export const UserModelClass = mongoose.model<UserModel>("User", userSchema)
export const RefreshTokenModelClass = mongoose.model<RefreshTokenModel>("RefreshToken", refreshTokenSchema)


export async function runDB(url: string, testDb?: boolean) { //: Promise<{ client: MongoClient, status?: boolean } | null>
    const dbName = testDb ? 'Testing' : SETTINGS.DB_NAME

    try {
        await mongoose.connect(url + "/" + dbName)
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
        return { status: true }
    } catch (e) {
        console.log(e);
        await mongoose.disconnect()
        return null
    }
}
