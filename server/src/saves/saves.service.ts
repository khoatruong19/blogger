import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { SaveResponse } from './dto/response/create-like-reponse.dto';
import { Save } from './entity/save.entity';

@Injectable()
export class SavesService {
    constructor(@InjectRepository(Save) private savesRepository : Repository<Save>, private postsService : PostsService){}

    async createSave(postId : string, user: User) : Promise<SaveResponse>{
        const post = await this.postsService.getPostById(postId)
        if(!post) throw new NotFoundException("This post doesnt exist")

        const save = this.savesRepository.create({userId: user.id, post})

        await this.savesRepository.save(save)

        return {
            id:save.id,
            userId: save.userId
        }
    }

    async deleteSave(postId: string, user:User) : Promise<{message:string}> {
        const post = await this.postsService.getPostById(postId)
        if(!post) throw new NotFoundException("This post doesnt exist")

        const save = await this.savesRepository.findOne({where: {userId: user.id}})

        if(!save) throw new NotFoundException("This save doesnt exist")
        await this.savesRepository.delete(save.id)
        
        return {message: "Unsaved"}
    }

   
}
