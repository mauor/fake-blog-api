import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';


@Module({
    imports:[
        TypeOrmModule.forFeature([
            Comment
        ]),
        AuthModule
    ],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class CommentsModule {}
