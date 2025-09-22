import { Request, Response, NextFunction } from 'express'
import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { SETTINGS } from '../../../settings'

@injectable()
export class OptionalAccessTokenMiddleware {
    public optionalAccessTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        if (!authHeader?.startsWith('Bearer ')) {
            console.log('optionalAccessTokenMiddleware err !authHeader');
            return next()
        }

        const token = authHeader.split(' ')[1]

        jwt.verify(token, SETTINGS.JWT_SECRET, (err, decoded: any) => {
            if (err || !decoded) {
                console.log('optionalAccessTokenMiddleware err !decoded');
                return next()
            }

            req.userId = decoded.userId
            req.userLogin = decoded.userLogin
            next()
        })
    }
}
