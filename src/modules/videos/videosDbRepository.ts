import { db } from "../../db/localDb"
import { InputChangeVideoType, InputVideoType } from '../../input-output-types/video-types'
import { VideoDBType } from '../../db/video-db'
import { videosCollection } from "../../db/mongoDb"
import { ObjectId } from "mongodb"

export const videosDBRepository = {
  async getAll(): Promise<VideoDBType[]> {
    return await videosCollection.find({}).toArray()
  },
  async findId(id: number | string) {
    const result = await videosCollection.findOne({id: +id})
    if (!result) {
      return null
    }
    return result
  },
  async findUuid(_id: ObjectId): Promise<VideoDBType | null> {
    return await videosCollection.findOne({_id: _id})
  },
  async delete(id: number): Promise<VideoDBType[]> {
    return db.videos = db.videos.filter(video => video.id !== +id)
  },
  async create(video: InputVideoType): Promise<ObjectId> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const publicationDate = (new Date(dateNow))
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()
    const newVideo: VideoDBType = {
      ...video,
      // _id: video._id ? video._id : undefined, //for test
      id: dateNow + Math.random(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAtISO,
      publicationDate: publicationDateISO,
    }
    
    // db.videos.push(newVideo)

    const res = await videosCollection.insertOne(newVideo)
    return res.insertedId // = new ObjectId('fdsfdsfdf')
  },
  async change(id: number, video: InputChangeVideoType): Promise<boolean> {
    const res = await videosCollection.updateOne(
      { id }, { $set: {...video}}
    )
    // const newVideo: VideoDBType = {
    //   ...video,
    //   id: oldVideo!.id,
    //   createdAt: oldVideo!.createdAt,
    // }
    // db.videos.map(video => video.id === id ? newVideo : video) 
    return res.matchedCount === 1
  },
}