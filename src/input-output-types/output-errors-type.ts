import { BlogInputType } from "./blog-types"
import { PostInputType } from "./post-types"

export type FieldNamesType = keyof BlogInputType | keyof PostInputType

export type OutputErrorsType = {
    errorsMessages: {message: string, field: FieldNamesType}[]
}