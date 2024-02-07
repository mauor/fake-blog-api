import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Max, Min } from 'class-validator';

enum EOrder {
    asc = 'ASC',
    desc = 'DESC',
}

export class PaginationDto {

    @ApiProperty({
        default: 10, 
        description: 'How many rows do you need.',
        required: false,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Max(100)
    @Type( () => Number ) // enableImplicitConversions: true
    limit?: number;
    
    @ApiProperty({
        default: 0, 
        description: 'How many rows do you want to skip.',
        required: false,
        minimum: 0
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;

    @ApiProperty({
        default: 'ASC', 
        description: 'Order of the result.',
        enum: EOrder,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value.toUpperCase())
    @IsEnum( EOrder )
    order?: EOrder;

}

