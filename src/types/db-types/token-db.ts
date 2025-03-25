import { Document } from "mongoose"

export interface RefreshTokenModel extends Document{
  ip: string;
  title: string;
  lastActiveDate: Date;
  expirationDate: Date;
  deviceId: string;
  userId: string;
}

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;  // ISO string format
  deviceId: string;
}

export type RefreshTokenPayloadType = {
  userId: string;
  lastActiveDate: string;  // ISO string format
  deviceId: string;
}
