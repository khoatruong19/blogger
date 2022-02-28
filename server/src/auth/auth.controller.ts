import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CurrentUser } from 'src/current-user.decorator';
import { CreateUserInput } from 'src/users/dto/request/create-user-input.dto';
import { UserResponse } from 'src/users/dto/response/user-response.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly usersService : UsersService) {}

  @Post("login")
  @UseGuards(AuthGuard("local"))
  async login(@CurrentUser() user: UserResponse, @Res({passthrough: true}) res: Response) : Promise<void>{
    return await this.authService.login(user, res)
  }

  @Post("signup")
  async signup(@Body() createUserInput : CreateUserInput) : Promise<UserResponse>{
      return await this.usersService.createUser(createUserInput)
  }
}
