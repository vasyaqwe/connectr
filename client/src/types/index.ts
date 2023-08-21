import { ValidationErrors } from "@/hooks/useFormValidation"
import { userSchema } from "@/lib/validations/user"
import * as z from "zod"

export type PaginatedData<T, K extends string> = {
    [key in K]: T[]
} & {
    totalPages: number
    page: number
}

export type DecodedToken = {
    profileImageUrl: string
    email: string
    _id: string
}

export type RawUser = z.infer<typeof userSchema>

export type User = RawUser & {
    _id: string
    profileImageUrl: string
    profileViews: number
    connections: string[]
}

export type UserFormData = RawUser & { confirmPassword: string }

export type PostFormData = {
    image?: undefined | File
    body: string
}

export type RawPost = {
    image?: { path: string; filename: string }
    body: string
}

export type Post = RawPost & {
    _id: string
    user: User
    comments: Comment[]
    likes: string[]
    createdAt: Date
    updatedAt: Date
}

export type RawComment = {
    body: string
}

export type Comment = RawComment & {
    _id: string
    user: User
    likes: string[]
    createdAt: Date
    updatedAt: Date
}

export type SignUpStepProps = {
    errors: ValidationErrors
    isLoading?: boolean
}

export type UserCredentials = {
    email: string
    password: string
}

export type CurrentStep<TStepName = string> = {
    idx: number
    name: TStepName
    requiredFields: string[]
}
