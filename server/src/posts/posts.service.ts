import { forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/request/create-post-input.dto';
import { UpdatePostInput } from './dto/request/update-post-input.dto';
import { PostResponse } from './dto/response/post-response.dto';
import { Post} from './entity/post.entity';

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private postsRepository : Repository<Post>){}

    async createPost(createPostInput: CreatePostInput, user: User) : Promise<PostResponse>{
        const post = this.postsRepository.create(createPostInput)
        post.author = user  
        await this.postsRepository.save(post)
        return this.buildRepsonse(post.id)
    }

    async getAllPosts() : Promise<PostResponse[]>{
        return await this.postsRepository.find({relations:["author", "likes", "saves"]})
    }

    async getPostById(postId : string) : Promise<PostResponse>{
        const post = await this.postsRepository.findOne(postId, {relations: ["author", "likes", "saves","comments"]})
        return post
    }

    async getPostsByUserId(userId : string) : Promise<PostResponse[]>{
        const post = await this.postsRepository.find({where: {author: userId}, relations: ["author", "likes", "saves", "comments"]})
        return post
    }

    async updatePost(postId:string, updatePostInput : UpdatePostInput) : Promise<PostResponse> {
        let updatePost = await this.postsRepository.findOne(postId,{relations:["author", "likes", "saves"]})

        updatePost = {...updatePost, ...updatePostInput, updatedAt: new Date}

        await this.postsRepository.save(updatePost)

        console.log(updatePost)

        return updatePost
    }

    async deletePost(postId:string) : Promise<{message: string}>{
        const findPost = this.postsRepository.findOne(postId)
        if(!findPost) throw new NotFoundException("This post does not exist")

        await this.postsRepository.delete(postId)

        return {message: "Delete successfully"}
    }

    async buildRepsonse(postId : string)  : Promise<PostResponse>{
        return await this.postsRepository.findOne(postId, {relations:["author","likes","saves","comments"]})
    }
}
