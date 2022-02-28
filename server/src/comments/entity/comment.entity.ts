import { PostResponse } from "src/posts/dto/response/post-response.dto";
import { Post } from "src/posts/entity/post.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    content: string

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt: Date
    
    @ManyToOne(() => User, user => user.comments,{onDelete: "CASCADE"})
    author: User

    @ManyToOne(() => Post, post => post.comments,{onDelete: "CASCADE"})
    post: PostResponse
}