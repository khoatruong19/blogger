import { Post } from "src/posts/entity/post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    userId: string

    @ManyToOne(() => Post, post => post.likes, {
        onDelete: "CASCADE"
    })
    post: Post 
}