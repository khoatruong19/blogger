import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/request/create-user-input.dto';
import { UserResponse } from './dto/response/user-response.dto';
import { User } from './entity/user.entity';
import * as bcrypt from "bcrypt"
import { UpdateUserRequest } from './dto/request/update-user-request';
import { UpdateUserResponse } from './dto/response/update-user-response.dto';
import { Post } from 'src/posts/entity/post.entity';
import { Comment } from 'src/comments/entity/comment.entity';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository : Repository<User>){}

    async createUser(createUserInput : CreateUserInput) : Promise<UserResponse> {
        await this.validateExistUser(createUserInput)
        const newUser = this.usersRepository.create({...createUserInput, password: await bcrypt.hash(createUserInput.password,10)})
        await this.usersRepository.save(newUser)
        const response = this.buildUserResponse(newUser)
        return response
    }

    async getUserById(userId: string) : Promise<UserResponse> {
        const user = await this.usersRepository.findOne({where: {id: userId}, relations: ["posts", "comments"]})
        if(!user) throw new NotFoundException("User not found by id: ",userId)
        return this.buildUserResponse(user)
    }

    async updateUser(user: UserResponse, updateInput: UpdateUserRequest) : Promise<UpdateUserResponse> {
        let userUpdate = await this.usersRepository.findOne({where: {id: user.id}})
        if(!user) throw new NotFoundException("User not found by id: ",user.id)
        if(updateInput.password) updateInput.password = await bcrypt.hash(updateInput.password,10)
        userUpdate = {...userUpdate, ...updateInput}
        await this.usersRepository.save(userUpdate)
        return {message: "Update username successfully!"}
    }

    async getAllUsers() : Promise<User[]>{
        
        return await this.usersRepository.find()
    }

    async validateUser(email: string, password: string){
        const user = await this.usersRepository.findOne({where: {email}})
        if(!user) throw new NotFoundException("User doesn't exist!")

        const passwordIsValid = await bcrypt.compare(password, user.password)
        if(!passwordIsValid) throw new UnauthorizedException("Credentials are invalid")

        return this.buildUserResponse(user)
    }
  
    private async validateExistUser(createUserInput : CreateUserInput) {
      const user = await this.usersRepository.findOne({where: {email: createUserInput.email}})
      if(user){
        throw new BadRequestException("This email is already exists")
        }
    }

    async isAuthorOfPost(user: User, postId: string) : Promise<boolean> {
        let found : boolean = false
        user.posts.map((post : Post) => {
            console.log(post.id)
            if(post.id == postId) found = true
        })

        return found
    }

    async isAuthorOfComment(user: User, commentId: string) : Promise<boolean> {
        let found : boolean = false
        user.comments.map((comment : Comment) => {
            if(comment.id == commentId) found = true
        })

        return found
    }

    private buildUserResponse(user: User) : UserResponse {
        const {password, ... rest} = user
        return rest
    }
}
