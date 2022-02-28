import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SavesModule } from './saves/saves.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,  
    autoLoadEntities: true,
  }), DatabaseModule, UsersModule, AuthModule, PostsModule, CommentsModule, LikesModule, SavesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
