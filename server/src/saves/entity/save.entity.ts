import { Post } from "src/posts/entity/post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Save {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    userId: string

    @ManyToOne(() => Post, post => post.saves, {
        onDelete: "CASCADE"
    })
    post: Post 
}