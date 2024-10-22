import { db } from "../../db/db"
import { InputChangeVideoType, InputVideoType } from '../../input-output-types/video-types'
import { VideoDBType } from '../../db/video-db'

export const videosDBRepository = {
  async getAll(): Promise<VideoDBType[]> {
    return db.videos
  },
  async findId(id: number): Promise<VideoDBType | undefined> {
    return db.videos.find(video => video.id === +id)
  },
  async delete(id: number): Promise<VideoDBType[]> {
    return db.videos = db.videos.filter(video => video.id !== +id)
  },
  async create(video: InputVideoType): Promise<VideoDBType> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const publicationDate = (new Date(dateNow))
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()
    const newVideo: VideoDBType = {
      ...video,
      id: dateNow + Math.random(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAtISO,
      publicationDate: publicationDateISO,
    }
    
    db.videos.push(newVideo)
    return newVideo
  },
  async change(id: number, video: InputChangeVideoType): Promise<VideoDBType> {
    const oldVideo = await videosDBRepository.findId(id)
    const newVideo: VideoDBType = {
      ...video,
      id: oldVideo!.id,
      createdAt: oldVideo!.createdAt,
    }
    db.videos.map(video => video.id === id ? newVideo : video)
    return newVideo
  },
}