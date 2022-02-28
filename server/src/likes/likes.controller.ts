import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { LikeResponse } from './dto/response/create-like-response.dto';
import { Like } from './entity/like.entity';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post("/:postId")
  @UseGuards(JwtAuthGuard)
  async createLike(@Param("postId") postId : string, @CurrentUser() user : User) : Promise<{message: string} | LikeResponse>{
    return await this.likesService.createLike(postId, user)
  }

  @Delete("/:postId")
  @UseGuards(JwtAuthGuard)
  async deleteLike(@Param("postId") postId : string, @CurrentUser() user : User) : Promise<{message: string}>{
    return await this.likesService.deleteLike(postId, user)
  }
}
