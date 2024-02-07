import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto/index';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetResponses } from 'src/commmon/decorators/getResponses.decorator';
import { PostResponses } from 'src/commmon/decorators/postResponses.decorator';
import { PatchResponses } from 'src/commmon/decorators/patchResponses.decorator';
import { DeleteResponses } from 'src/commmon/decorators/deleteResponses.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @PostResponses( User )
    @Auth()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create( createUserDto );
    }

    @Get()
    @GetResponses( User, true )
    @Auth()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAll( paginationDto );
    }

    @Get(':term')
    @GetResponses( User )
    @Auth()
    @ApiParam( { 
        name: 'term', 
        description: 'UUID of the user or instead an email that is being searched',
        example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'
    })
    findOne(@Param('term') term: string) {
        return this.usersService.findOne( term );
    }

    @Patch(':id') 
    @PatchResponses()
    @ApiParam({ name: 'id', description: 'UUID of the user.', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @Auth()
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update( id, updateUserDto );
    }

    @Patch('password/:id') 
    @PatchResponses()
    @ApiParam({ name: 'id', description: 'UUID of the user.', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @Auth()
    updatePassword(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
        return this.usersService.updatePassword( id, updateUserPasswordDto );
    }

    @Delete(':id')
    @DeleteResponses()
    @ApiParam({ name: 'id', description: 'UUID of the user.', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @Auth()
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove( id );
    }
}