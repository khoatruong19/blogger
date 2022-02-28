import { forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentInput } from './dto/request/create-comment-request.dto';
import { UpdateCommentInput } from './dto/request/update-comment-input.dto';
import { CommentResponse } from './dto/response/comment-response.dto';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comment) private commentsRepository : Repository<Comment>,@Inject(forwardRef(() => PostsService)) private postsService : PostsService){}

    async createComment(user: User, postId: string, createCommentInput : CreateCommentInput) : Promise<CommentResponse>{
        const post = await this.postsService.getPostById(postId)
        const newComment = this.commentsRepository.create(createCommentInput)
        newComment.author = user
        newComment.post = post 
        await this.commentsRepository.save(newComment)
        return this.buildResponse(newComment)
     
    }

    async getCommentsByPost(postId : string) : Promise<CommentResponse[]>{
        const post = await this.postsService.getPostById(postId)
        const comments = await this.commentsRepository.find({where: {post}, relations:["author"]})
        const commentsResponse = comments.map(comment => {
            return {...comment, author: {
                id: comment.author.id,
                username: comment.author.username,
                image: comment.author.image,
            }}
        })
        console.log(commentsResponse)
        return commentsResponse
    }

    async buildResponse(comment: Comment) : Promise<CommentResponse>{
        return {
            id: comment.id,
            createdAt: comment.createdAt,
            content: comment.content,
            author:{
                id: comment.author.id,
                username: comment.author.username,
                image: comment.author.image
            }
        }
    }
    

    async updateComment(commentId: string, updateCommentInput : UpdateCommentInput) : Promise<Comment>{
        const comment = await this.commentsRepository.findOne(commentId)
        comment.content = updateCommentInput.content
        return await this.commentsRepository.save(comment)
    }

    async deleteComment(commentId : string) : Promise<{message: string}>{
        const found = await this.commentsRepository.findOne(commentId)
        if(!found) throw new NotFoundException("This post does not exist!") 

        else await this.commentsRepository.delete(commentId)
        return {message: "Deleted successfully"}
    }
}
