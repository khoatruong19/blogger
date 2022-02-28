import { Like } from "src/likes/entity/like.entity"
import { Save } from "src/saves/entity/save.entity"
import { User } from "src/users/entity/user.entity"

export class PostResponse{
    id: string

    title:string

    description: string

    image: string

    categories: string[]

    updatedAt?: Date

    likes: Like[]

    saves: Save[]

    comments?: {
        id :string
        content: string
        createdAt: Date
        author:{
            username: string
            image: string
        }
    }[]

    author: User

}