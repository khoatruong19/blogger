import { Module } from '@nestjs/common';
import { SavesService } from './saves.service';
import { SavesController } from './saves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Save } from './entity/save.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Save]), PostsModule],
  controllers: [SavesController],
  providers: [SavesService]
})
export class SavesModule {}
