import { SETTINGS } from "../settings"
import { Collection, MongoClient } from 'mongodb'
import { VideoDBType } from "./video-db";
import { BlogDBType } from "./blog-db";
import { PostDBType } from "./post-db";
// const uri = "mongodb+srv://symegu:admin@lessons.ri9n5.mongodb.net/?retryWrites=true&w=majority&appName=Lessons";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export let videosColletion: Collection<VideoDBType>
export let blogsCollection: Collection<BlogDBType>
export let postsCollection: Collection<PostDBType>

export async function runDB(url: string): Promise<boolean> {
    const client = new MongoClient(url)
    let db = client.db(SETTINGS.DB_NAME)

    videosColletion = db.collection<VideoDBType>(SETTINGS.PATH.VIDEOS)
    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS)
    
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect()
        // Send a ping to confirm a successful connection
        await db.command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
        return true
    } catch (e) {
        // Ensures that the client will close when you finish/error
        console.log(e);
        await client.close()
        return false
    }
}
