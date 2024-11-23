import { ObjectId } from "mongodb"

export type UserModel = {
  _id: ObjectId,
  login: string,
  email: string,
  password: string,
  createdAt: string
}

export type UserViewModel = {
  id: string,
  login: string,
  email: string,
  createdAt: string
}