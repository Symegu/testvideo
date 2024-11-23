import { SETTINGS } from "../settings"
import { Collection, MongoClient } from 'mongodb'
import { BlogModel } from "../types/db-types/blog-db";
import { PostModel } from "../types/db-types/post-db";
import { UserModel } from "../types/db-types/user-db";
import { CommentModel } from "../types/db-types/comment-db";
// const uri = "mongodb+srv://symegu:admin@lessons.ri9n5.mongodb.net/?retryWrites=true&w=majority&appName=Lessons";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export let blogsCollection: Collection<BlogModel>
export let postsCollection: Collection<PostModel>
export let usersCollection: Collection<UserModel>
export let commentsCollection: Collection<CommentModel>

export async function runDB(url: string, testDb?: boolean): Promise<{ client: MongoClient, status?: boolean } | null> {
    const client = new MongoClient(url)
    let db = client.db(testDb ? 'Testing' : SETTINGS.DB_NAME)
    blogsCollection = db.collection<BlogModel>(SETTINGS.PATH.BLOGS)
    usersCollection = db.collection<UserModel>(SETTINGS.PATH.USERS)
    postsCollection = db.collection<PostModel>(SETTINGS.PATH.POSTS)
    commentsCollection = db.collection<CommentModel>(SETTINGS.PATH.COMMENTS)

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect()
        // Send a ping to confirm a successful connection
        await db.command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
        return { client }
    } catch (e) {
        // Ensures that the client will close when you finish/error
        console.log(e);
        await client.close()
        return null
    }
}
