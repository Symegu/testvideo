import * as express from 'express'

declare global {
  namespace Express {
      export interface Request {
          userId: string | undefined,
          userLogin: string | undefined
      }
  }
}