import { Exclude } from "class-transformer";
import { Comment } from "src/comments/entity/comment.entity";
import { Post } from "src/posts/entity/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from "uuid"

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable : false})
    email: string

    @Column({nullable : false})
    password: string

    @Column("text",{default: uuid()})
    username: string

    @Column("text" , {default: "This is my bio"})
    bio: string

    @Column("text" , {default: "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"})
    image: string

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[]
} 