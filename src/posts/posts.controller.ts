import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';


import { diskStorage } from 'multer';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { fileFilter } from './helpers/fileFilter';
import { fileNamer } from './helpers/fileNamer';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { ValidationInterceptor } from './interceptors/file.interceptor';
import { GetResponses, PostResponses } from 'src/commmon/decorators';
import { Post as Posts } from './entities/post.entity';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Post()
    @Auth()
    @ApiConsumes('multipart/form-data')
    @PostResponses( Posts )
    @UseInterceptors(
        FileInterceptor('image', {
            limits: { fileSize: 1024 * 1024 * 2 },
            fileFilter: fileFilter,
            storage: diskStorage({
                destination: './static/uploads',
                filename: fileNamer
            })
        }),
        ValidationInterceptor
    )
    create(
        @Body() createPostDto: CreatePostDto, 
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any
    ) {
        const user = req.user;
        return this.postsService.create(createPostDto, user, file);
    }

    @Get()
    @Auth()
    @GetResponses( Posts, true )
    findAll(@Query() paginationDto: PaginationDto) {
        return this.postsService.findAll(paginationDto);
    }

    @Get(':term')
    @Auth()
    @GetResponses( Posts )
    @ApiParam({ 
        name: 'term', 
        description: 'UUID of the post or instead the title of the post that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    findOne(@Param('term') term: string) {
        return this.postsService.findOne( term );
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(+id);
    }
}
