// import { Comment } from "src/comments/entity/comment.entity";
import { Comment } from "src/comments/entity/comment.entity";
import { Like } from "src/likes/entity/like.entity";
import { Save } from "src/saves/entity/save.entity";
import { User } from "src/users/entity/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Post{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column({length: 5000,})
    description: string

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt: Date
    
    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    updatedAt: Date

    // @BeforeUpdate()
    // updateTimestamp(){
    //     this.updatedAt = new Date()
    // }

    @Column({nullable: true})
    publishedDate: Date;

    @Column("text", {default: "https://i.pinimg.com/originals/6f/a9/c3/6fa9c33211ce7c08f2cc4fcef6144b7d.png"})
    image: string

    @OneToMany(() => Like, like => like.post, {
        onDelete: "CASCADE"
    })
    likes: Like[]

    @OneToMany(() => Save, save => save.post, {
        onDelete: "CASCADE"
    })
    saves: Save[]

    @OneToMany(() => Comment, comment => comment.post, {
        onDelete: "CASCADE"
    })
    comments: Comment[]

    @Column("text",{ array: true})
    categories: string[]

    @ManyToOne(() => User, user => user.posts, {
        onDelete: "CASCADE"
    })
    author: User
}


