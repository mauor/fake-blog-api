import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interface/jwt_payload';
import { LoginDto } from './dto/login.dto';



@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,  
        private readonly jwtService: JwtService      
    ){}

    async login(loginDto: LoginDto){
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne( {
            where: { email },
            select: { email: true, password: true, user_id: true }
        } );
        if( !user ) throw new UnauthorizedException('Credentials are not valid (email).');
        if( !user.password === bcrypt.compareSync(password, user.password) )
            throw new UnauthorizedException('Credentials are not valid (password).');
        delete user.password;
        return {
            user,
            token: await this.getJwtToken({ user_id: user.user_id, email: user.email })
        };  
    }

    async getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign( payload );
        return token;
    }
}
