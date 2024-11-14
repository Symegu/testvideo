import { ObjectId } from "mongodb"

export type BlogModel = {
  _id?: ObjectId,
  id:	string,
  name:	string,
  description: string,
  websiteUrl:	string,
  createdAt: string,
  isMembership: boolean
}

export type BlogViewModel = {
  id:	string,
  name:	string,
  description: string,
  websiteUrl:	string,
  createdAt: string,
  isMembership: boolean
}