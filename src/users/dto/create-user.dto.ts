import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches, MinLength } from "class-validator";

export class CreateUserDto {

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
    @IsString()
    @MinLength(8)
    @Matches( /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[-_;´!@#$%^&+*(),.?":{}|<>])(?=\S+$)/, 
        { message: 'password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }
    ) 
    password: string;
    
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
