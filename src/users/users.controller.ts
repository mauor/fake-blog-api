import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto/index';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({ description: 'User was created.', type: User, isArray: true  })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @ApiForbiddenResponse( { description: 'Forbidden. Token related.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create( createUserDto );
    }

    @Get()
    @ApiOkResponse({ description: 'Ok', type: User, isArray: true })
    @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
    @ApiNotFoundResponse({ description: 'Users not found.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAll( paginationDto );
    }

    @Get(':term')
    @ApiOkResponse({ description: 'Ok', type: User})
    @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
    @ApiNotFoundResponse({ description: 'Users not found.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @ApiParam({ name: 'term', description: 'UUID of the user or instead an email that is being searched', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    findOne(@Param('term') term: string) {
        return this.usersService.findOne( term );
    }

    @Patch(':id') 
    @ApiOkResponse({ description: 'User updated', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @ApiParam({ name: 'id', description: 'UUID of the user.', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update( id, updateUserDto );
    }

    @Patch('password/:id') 
    @ApiOkResponse({ description: 'Password updated.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @ApiParam({ name: 'id', description: 'UUID of the user.', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    updatePassword(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
        return this.usersService.updatePassword( id, updateUserPasswordDto );
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'User deleted.'})
    @ApiForbiddenResponse({ description: 'Forbidden. Token related.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @ApiParam({ name: 'id', description: 'UUID of the user.', example: '3957c2a3-4634-45c5-a83b-fb53d15d6242'})
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove( id );
    }
}
