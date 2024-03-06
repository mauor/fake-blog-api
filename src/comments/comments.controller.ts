import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from 'src/auth/decorators';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteResponses, GetResponses, PostResponses } from 'src/commmon/decorators';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @Auth()
    @PostResponses( Comment )
    create(
        @Body() createCommentDto: CreateCommentDto, 
        @GetUser() user: User
    ) {
        return this.commentsService.create(createCommentDto, user);
    }

    @Get( 'post/:id' )
    @GetResponses( Comment, true )
    @ApiParam({ 
        name: 'id', 
        description: 'UUID of the post that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    findAll(
        @Query() paginationDto: PaginationDto, 
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.commentsService.findAllByPost( paginationDto, id );
    }

    @Get(':id')
    @GetResponses( Comment )
    @ApiParam({ 
        name: 'id', 
        description: 'UUID of the comment that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.commentsService.findOne( id );
    }

    // @Patch(':id')
    // @Auth()
    // @PatchResponses( Comment )
    // @ApiParam({ 
    //     name: 'id', 
    //     description: 'UUID of the comment that is being searched.',
    //     example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    // })
    // update(
    //     @Param('id', ParseUUIDPipe) id: string, 
    //     @Body() updateCommentDto: UpdateCommentDto,
    //     @GetUser() user: User
    // ) {
    //     return this.commentsService.update( id, updateCommentDto, user );
    // }

    @Delete(':id')
    @Auth()
    @DeleteResponses( Comment )
    @ApiParam({ 
        name: 'id', 
        description: 'UUID of the comment that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() user: User
    ) {
        return this.commentsService.remove( id, user );
    }
}
