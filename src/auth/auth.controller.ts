import { Request, Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService ){}

    @ApiOkResponse({ description: 'Login successful.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @Post('login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

    @ApiOkResponse({ description: 'Ok.', type: User })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
