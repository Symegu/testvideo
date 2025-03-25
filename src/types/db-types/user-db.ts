import { Document } from "mongoose"

export interface EmailConfirmation {
  confirmationCode: string;
  expirationDate: string;
  status: ConfirmationStatus;
}

export enum ConfirmationStatus {
  NotConfirmed = 0,
  Confirmed = 1,
  Declined = 2,
  Canceled = 3
}

export interface UserModel extends Document {
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
}

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
