import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Req, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { DeleteResponses, GetResponses, PatchResponses, PostResponses } from 'src/commmon/decorators';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { Post as Posts } from './entities/post.entity';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileUpload } from 'src/commmon/decorators/fileUpload.decorator';

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
    @FileUpload( 'image' )
    create(
        @Body() createPostDto: CreatePostDto, 
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any
    ) {
        const user = req.user;
        return this.postsService.create(createPostDto, user, file);
    }

    @Get()
    @GetResponses( Posts, true )
    findAll(@Query() paginationDto: PaginationDto) {
        return this.postsService.findAll(paginationDto);
    }

    @Get(':term')
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
    @Auth()
    @PatchResponses( Posts )
    @FileUpload( 'image' )
    @ApiParam({
        name: 'id', 
        description: 'UUID of the post.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    update(
        @Param('id', ParseUUIDPipe ) id: string, 
        @Body() updatePostDto: UpdatePostDto, 
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.postsService.update( id, updatePostDto, file );
    }

    @Delete(':id')
    @Auth()
    @DeleteResponses( Posts )
    @ApiParam({
        name: 'id', 
        description: 'UUID of the post.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.postsService.remove( id );
    }
}
