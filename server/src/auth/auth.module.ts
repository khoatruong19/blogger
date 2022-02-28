import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: (configService : ConfigService) => ({
      secret: configService.get<string>("JWT_SECRET"),
      signOptions: {
        expiresIn: `${configService.get("EXPIRATION_TIME")}`
      }
    }),
    inject: [ConfigService]
  }),UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
