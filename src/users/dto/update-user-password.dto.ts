import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserPasswordDto{

    @ApiProperty({
        example: 'Ix58-3Bj',
        description: 'Current password chosen by the user, serving as a security measure to authenticate and protect access to the account.',
    })
    @IsString()
    @MinLength(8)
    @Matches( /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[-_;´!@#$%^&+*(),.?":{}|<>])(?=\S+$)/, 
        { message: 'password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }
    ) 
    old_password: string;

    @ApiProperty({
        example: 'Aj18*z2Hn',
        description: 'New password chosen by the user, serving as a security measure to authenticate and protect access to the account.',
    })
    @IsString()
    @MinLength(8)
    @Matches( /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[-_;´!@#$%^&+*(),.?":{}|<>])(?=\S+$)/, 
        { message: 'password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }
    ) 
    password: string;
}