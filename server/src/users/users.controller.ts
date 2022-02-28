import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/current-user.decorator';
import { UpdateUserRequest } from './dto/request/update-user-request';
import { CreateUserInput } from './dto/request/create-user-input.dto';
import { UserResponse } from './dto/response/user-response.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UpdateUserResponse } from './dto/response/update-user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserInput : CreateUserInput ) : Promise<UserResponse> {
    return this.usersService.createUser(createUserInput)
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserResponse): Promise<UserResponse>{
    return user
  }

  @Get("/all")
  async getAllUsers() : Promise<User[]>{
    return this.usersService.getAllUsers()
  }

  @Get("/:userId")
  async getUserById(@Param("userId") userId : string){
    return this.usersService.getUserById(userId)
  }

  @Post("/update")
  @UseGuards(JwtAuthGuard)
  async changeUsername(@CurrentUser() user: UserResponse, @Body() updateInput : Partial<UpdateUserRequest>) : Promise<UpdateUserResponse>{
    return this.usersService.updateUser(user, updateInput)  
  }
 
}
