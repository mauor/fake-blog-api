import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interface/jwt_payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const { user_id } = payload;
        const user = this.userRepository.findOne( {
            where: { user_id }    
        })
        if( !user ) throw new UnauthorizedException('Token not valid.')

        return user;
    }
}