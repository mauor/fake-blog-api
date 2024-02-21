import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AuthModule } from 'src/auth/auth.module';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        TypeOrmModule.forFeature([
            Post
        ]),
        AuthModule,
        ConfigModule
    ],
    controllers: [PostsController],
    providers: [PostsService]
})
export class PostsModule {}
