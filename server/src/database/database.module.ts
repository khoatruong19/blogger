import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";


@Module({
    imports:[TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,  
        autoLoadEntities: true,
      })],
    exports: [TypeOrmModule]
})
export class DatabaseModule {
    constructor(private connection : Connection) {
        if(connection) console.log("DB connected")
    }
}