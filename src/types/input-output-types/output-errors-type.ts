import { EmailConfirmation } from "../db-types/user-db"
import { BlogInputModel } from "./blog-types"
import { PostInputModel } from "./post-types"
import { LoginInputModel, UserInputModel } from "./user-types"

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof LoginInputModel | keyof UserInputModel | keyof EmailConfirmation | 'code'

export type OutputErrorsType = {
    errorsMessages: { message: string, field: FieldNamesType }[]
}

export enum HttpStatuses {
    Success = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    ServerError = 500,
}

export enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest',
    InternalServerError = 'InternalServerError'
}

type ExtensionType = {
    field: FieldNamesType | null,
    message: string
}

export type Result<T = null> = {
    status: ResultStatus,
    errorMessage?: string,
    extensions?: ExtensionType[],
    data: T
}