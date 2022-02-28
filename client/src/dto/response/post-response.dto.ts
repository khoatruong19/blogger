import { UserResponse } from "./user-response.dto";

export interface PostResponse{
    id: string

    title: string

    description: string

    image: string

    categories: string[]

    likes: {
        userId :string
    }[]

    saves: {
        userId :string
    }[]

    comments: {
        id :string
        content: string
        createdAt: Date
        author:{
            username: string
            image: string
        }
    }[]


    author: UserResponse

    updatedAt: Date
}
