import { Request, Controller, Post, Get, Body } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService ){}

    @ApiOkResponse({ description: 'Login successful.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @Post('login')
    @ApiOperation({ summary: 'Login to the app.' })
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

    @ApiOkResponse({ description: 'Ok.', type: User })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @Auth()
    @Get('profile')
    @ApiOperation({ summary: 'Info about the user logged in.' })
    getProfile(@Request() req) {
        return req.user;
    }
}
