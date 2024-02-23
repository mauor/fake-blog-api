import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty({
        example: 'Tecnology',
        description: 'Name of the category.',
        uniqueItems: true
    })
    @IsString()
    @MinLength( 3 )
    @MaxLength( 255 )
    category: string;

    @ApiPropertyOptional({
        example: 'Category that talks about technological topics.',
        description: 'Description of the category.',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MinLength( 3 )
    description?: string;

}
