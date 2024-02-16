import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';


import { diskStorage } from 'multer';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { fileFilter } from './helpers/fileFilter';
import { fileNamer } from './helpers/fileNamer';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { ValidationInterceptor } from './interceptors/file.interceptor';
import { PostResponses } from 'src/commmon/decorators';
import { Post as Posts } from './entities/post.entity';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService ) {}

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
        createPostDto.image = file?.filename;
        return this.postsService.create(createPostDto, user);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(+id);
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
