export type RefreshTokenModel = {
  ip: string, //IP address of device during signing in
  title: string, //Device name
  lastActiveDate: string,
  expirationDate: string, //Date of the last generating of refresh/access tokens
  deviceId: string, //Id of connected device session
  userId: string
}

export type DeviceViewModel = {
  ip: string, //IP address of device during signing in
  title: string, //Device name
  lastActiveDate: string, //Date of the last generating of refresh/access tokens
  deviceId: string //Id of connected device session
}

export type RefreshTokenPayloadType = {
  userId: string,
  lastActiveDate: string,
  deviceId: string
}