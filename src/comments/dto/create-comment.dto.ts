import { ApiProperty } from "@nestjs/swagger";

import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {

    @ApiProperty({
        example: `Nice post.`,
        description: 'Content of the comment.',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    comment: string;

    @ApiProperty({
        example: `3a9c732f-fb5d-4a72-b5f9-bb5354932e01`,
        description: 'Unique identifier assigned to each user within a system.',
    })
    @IsUUID()
    user_id: string;

    @ApiProperty({
        example: `3a9c732f-fb5d-4a72-b5f9-bb5354932e01`,
        description: 'Unique identifier assigned to each post within a system.'
    })
    @IsUUID()
    post_id: string;

}
