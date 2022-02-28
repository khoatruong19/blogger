import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy} from "passport-jwt";
import { UserResponse } from "src/users/dto/response/user-response.dto";
import { UsersService } from "src/users/users.service";
import { TokenPayload } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService : ConfigService, private readonly usersService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get("JWT_SECRET")
        })
    }


    async validate(payload: TokenPayload) : Promise<UserResponse> {
        return this.usersService.getUserById(payload.userId)
    }
}