import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMimeType, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreatePostDto {

    @ApiProperty({
        example: `Unveiling Nature's Wonders: Journey through the Marvels of the Natural World.`,
        description: 'Title unique for the post.',
        uniqueItems: true,
        minLength: 3,
        maxLength: 255
    })
    @IsString()
    @Length(3, 255)
    title: string;

    @ApiProperty({
        example: `Embark on a captivating journey through the most remote and astonishing corners of our planet, where natural beauty unfolds in all its majesty. From the depths...`,
        description: 'Content of the post.',
    })
    @IsString()
    article: string;

    @ApiPropertyOptional({
        description: 'Main image of the post.',
        type: 'file',
    })
    @IsOptional()
    image?: any;

    @ApiHideProperty()
    @IsOptional()
    image_url: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: 'Some description.',
        description: 'Short description abot the content of the article.',
        nullable: true,
    })
    description?: string;

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8.',
        description: 'Unique identifier assigned to each category within a system.',
        nullable: false,
    })
    @IsUUID()
    category_id: string;
}
