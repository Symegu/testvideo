import { WithId } from "mongodb"

export type BlogModel = WithId<{
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: Date,
  isMembership: boolean
}>

export type BlogViewModel = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean
}