import { ObjectId } from "mongodb"

export type UserModel = {
  _id: ObjectId,
  login: string,
  email: string,
  password: string,
  createdAt: string,
  emailConfirmation: EmailConfirmation
}

export type UserViewModel = {
  id: string,
  login: string,
  email: string,
  createdAt: string
}

export type EmailConfirmation = {
  confirmationCode: string,
  expirationDate: string,
  status: ConfirmationStatus
}

enum ConfirmationStatus {
  NotConfirmed = 0,
  Confirmed = 1,
  Declined = 2,
  Canceled = 3
}