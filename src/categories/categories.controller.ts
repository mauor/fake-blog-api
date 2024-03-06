import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/index';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteResponses, GetResponses, PatchResponses, PostResponses } from 'src/commmon/decorators/index';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Role } from 'src/auth/interface/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @PostResponses( Category )
    @Auth( Role.Admin )
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create( createCategoryDto );
    }

    @Get()
    @GetResponses( Category, true )
    findAll(@Query() paginationDto: PaginationDto) {
        return this.categoriesService.findAll( paginationDto );
    }

    @Get(':term')
    @GetResponses( Category )
    @ApiParam({ 
        name: 'term', 
        description: 'UUID of the category or instead the name of the category that is being searched.',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    findOne(@Param('term') term: string) {
        return this.categoriesService.findOne( term );
    }

    @Patch(':id')
    @PatchResponses( Category )
    @Auth( Role.Admin )
    @ApiParam( {
        name: 'id', 
        description: 'UUID of the category.', 
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    } )
    update(
        @Param('id', ParseUUIDPipe) id: string, 
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return this.categoriesService.update( id, updateCategoryDto );
    }

    @Delete(':id')
    @DeleteResponses( Category )
    @Auth( Role.Admin )
    @ApiParam( {
        name: 'id', 
        description: 'UUID of the category.', 
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    } )
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.remove( id );
    }
}
