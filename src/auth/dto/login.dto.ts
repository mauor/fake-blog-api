import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MinLength } from 'class-validator';


export class LoginDto {


    @ApiProperty({
        example: 'example@example.com',
        description: 'Users unique email address, used for account access.',
        uniqueItems: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Ix58-3Bj',
        description: 'Confidential alphanumeric code chosen by the user during registration, serving as a security measure to authenticate and protect access to the account.',
        minLength: 8,
    })
    @MinLength(8)
    @Matches( /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[-_;´!@#$%^&+*(),.?":{}|<>])(?=\S+$)/, 
        { message: 'password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }
    )
    password: string;

}