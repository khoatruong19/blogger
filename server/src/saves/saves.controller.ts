import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { SaveResponse } from './dto/response/create-like-reponse.dto';
import { SavesService } from './saves.service';

@Controller('saves')
export class SavesController {
  constructor(private readonly savesService: SavesService) {}
  @Post("/:postId")
  @UseGuards(JwtAuthGuard)
  async createSave(@Param("postId") postId : string, @CurrentUser() user : User) : Promise<SaveResponse>{
    return await this.savesService.createSave(postId, user)
  }

  @Delete("/:postId")
  @UseGuards(JwtAuthGuard)
  async deleteSave(@Param("postId") postId : string, @CurrentUser() user : User) : Promise<{message: string}>{
    return await this.savesService.deleteSave(postId, user)
  }
}
