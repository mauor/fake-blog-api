import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetResponses, PostResponses } from 'src/commmon/decorators';
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
    findOne(@Param('id') id: string) {
        return this.commentsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.update(+id, updateCommentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commentsService.remove(+id);
    }
}
