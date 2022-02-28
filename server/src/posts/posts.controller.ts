import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { CreatePostInput } from './dto/request/create-post-input.dto';
import { UpdatePostInput } from './dto/request/update-post-input.dto';
import { PostResponse } from './dto/response/post-response.dto';
import { IsPostAuthor } from './guards/isPostAuthor.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostInput: CreatePostInput, @CurrentUser() user) : Promise<PostResponse>{
    return await this.postsService.createPost(createPostInput,user)
  }

  @Get("/")
  async getPosts(@Query("userId") userId: string) : Promise<PostResponse[]>{
     return await this.postsService.getAllPosts()
  }

  @Get("/byUser/:userId")
  async getPostByUserId(@Param("userId") userId: string) : Promise<PostResponse[]>{
    return await this.postsService.getPostsByUserId(userId)
  }

  @Put("/:postId")
  @UseGuards(JwtAuthGuard,IsPostAuthor)
  async updatePost(@Param("postId" ) postId :string, @Body() updatePostInput : UpdatePostInput) : Promise<PostResponse> {
    return this.postsService.updatePost(postId, updatePostInput)
  } 

  @Delete("/:postId")
  @UseGuards(JwtAuthGuard,IsPostAuthor)
  async deletePost(@Param("postId" ) postId :string) : Promise<{message: string}> {
    return this.postsService.deletePost(postId)
  } 

  @Get("/:postId")
  async getPostById(@Param("postId") postId: string) : Promise<PostResponse>{
     return await this.postsService.getPostById(postId)
  }
}
