import { BlogInputType } from "./blog-types"
import { PostInputType } from "./post-types"
import { InputChangeVideoType, InputVideoType } from "./video-types"

export type FieldNamesType = keyof BlogInputType | keyof PostInputType | keyof InputVideoType | keyof InputChangeVideoType

export type OutputErrorsType = {
    errorsMessages: {message: string, field: FieldNamesType}[]
}