import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "src/users/entity/user.entity";
import { UsersService } from "src/users/users.service";


@Injectable()
export class IsPostAuthor implements CanActivate {
    constructor(private usersService : UsersService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        
        const params = request.params

        const postId : string = params.postId

        const user : User = request.user

        return this.usersService.isAuthorOfPost(user, postId)
    }
}