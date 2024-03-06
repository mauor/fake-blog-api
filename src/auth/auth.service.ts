import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { JwtPayload } from './interface/jwt_payload.interface';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';



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
            select: { email: true, password: true, user_id: true, role: true }
        } );
        if( !user ) throw new UnauthorizedException('Credentials are not valid (email).');
        if( !user.password === bcrypt.compareSync(password, user.password) )
            throw new UnauthorizedException('Credentials are not valid (password).');
        delete user.password;
        return {
            token: await this.getJwtToken({ ...user })
        };  
    }

    async getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign( payload );
        return token;
    }
}
