import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteResponses, GetResponses, PatchResponses, PostResponses } from 'src/commmon/decorators';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @Auth()
    @PostResponses( Comment )
    create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
        const user = req.user;
        return this.commentsService.create(createCommentDto, user);
    }

    @Get()
    @Auth()
    @GetResponses( Comment, true )
    findAll(@Query() paginationDto: PaginationDto) {
        return this.commentsService.findAll( paginationDto );
    }

    @Get(':id')
    @Auth()
    @GetResponses( Comment )
    @ApiParam({ 
        name: 'id', 
        description: 'UUID of the comment that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.commentsService.findOne( id );
    }

    @Patch(':id')
    @Auth()
    @PatchResponses( Comment )
    @ApiParam({ 
        name: 'id', 
        description: 'UUID of the comment that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.update(id, updateCommentDto);
    }

    @Delete(':id')
    @Auth()
    @DeleteResponses( Comment )
    @ApiParam({ 
        name: 'id', 
        description: 'UUID of the comment that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.commentsService.remove( id );
    }
}
