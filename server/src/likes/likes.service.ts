import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { LikeResponse } from './dto/response/create-like-response.dto';
import { Like } from './entity/like.entity';

@Injectable()
export class LikesService {
    constructor(@InjectRepository(Like) private likesRepository : Repository<Like>, private postsService : PostsService){}

    async createLike(postId : string, user: User) : Promise<LikeResponse>{
        const post = await this.postsService.getPostById(postId)
        if(!post) throw new NotFoundException("This post doesnt exist")

        const like = this.likesRepository.create({userId: user.id, post})

        await this.likesRepository.save(like)

        return {
            id: like.id,
            userId: like.userId,
        }
    }

    async deleteLike(postId: string, user:User) : Promise<{message: string}> {
        const post = await this.postsService.getPostById(postId)
        if(!post) throw new NotFoundException("This post doesnt exist")

        const like = await this.likesRepository.findOne({where: {userId: user.id}})

        if(!like) throw new NotFoundException("This like doesnt exist")
        await this.likesRepository.delete(like.id)
        return {message: "Unliked"}
    }

}
