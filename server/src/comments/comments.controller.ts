import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/request/create-comment-request.dto';
import { UpdateCommentInput } from './dto/request/update-comment-input.dto';
import { CommentResponse } from './dto/response/comment-response.dto';
import { Comment } from './entity/comment.entity';
import { IsCommentAuthor } from './guards/isCommentAuthor.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("/:postId")
  @UseGuards(JwtAuthGuard)
  async createComment(@CurrentUser() user : User, @Param("postId") postId : string, @Body() createCommentInput : CreateCommentInput ) : Promise<CommentResponse>  {
    return this.commentsService.createComment(user,postId, createCommentInput)
  }

  @Get("/:postId")
  async getCommentsByPost(@Param("postId") postId: string) : Promise<CommentResponse[]> {
    return await this.commentsService.getCommentsByPost(postId)
  }

  @Put("/:commentId")
  @UseGuards(JwtAuthGuard, IsCommentAuthor)
  async updateComment(@Param("commentId") commentId: string, @Body() updateCommentInput : UpdateCommentInput) : Promise<Comment>{
    return await this.commentsService.updateComment(commentId, updateCommentInput)
  }

  @Delete("/:commentId")
  @UseGuards(JwtAuthGuard, IsCommentAuthor)
  async deleteComment(@Param("commentId") commentId: string) : Promise<{message:string}>{
    return await this.commentsService.deleteComment(commentId)
  }
}
