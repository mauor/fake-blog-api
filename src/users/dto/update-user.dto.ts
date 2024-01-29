import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, Length } from 'class-validator';

export class UpdateUserDto{

    @ApiProperty({
        example: 'example@example.com',
        description: 'Users unique email address, used for account access.',
        uniqueItems: true
    })
    @IsEmail()
    email: string;
    
    @ApiProperty({
        example: 'John',
        description: 'The given or first name of the user.',
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'The surname or family name of the user.',
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    last_name: string;

    @ApiProperty({
        example: 'M',
        description: 'Denotes the gender identity of the user, specifying whether they identify as male, female or another.',
    })
    @IsString()
    @Length( 1, 1)
    gender?: string;
}
