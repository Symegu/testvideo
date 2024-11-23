import { BlogInputModel } from "./blog-types"
import { PostInputModel } from "./post-types"
import { LoginInputModel, UserInputModel } from "./user-types"

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof LoginInputModel | keyof UserInputModel

export type OutputErrorsType = {
    errorsMessages: {message: string, field: FieldNamesType}[]
}