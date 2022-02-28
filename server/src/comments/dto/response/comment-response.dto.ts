export class CommentResponse{
    id: string

    content: string

    createdAt: Date

    author:{
        id: string
        username: string
        image:string
    }

}