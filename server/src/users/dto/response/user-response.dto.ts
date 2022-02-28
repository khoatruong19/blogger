import { Post } from "src/posts/entity/post.entity"

export class UserResponse {
    id: string
    username: string
    bio: string
    image: string
    // posts: Post[]
}