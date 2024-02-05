import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [  
        TypeOrmModule.forFeature([
            User
        ]),
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn:'2h'
                    }       
                }
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}

