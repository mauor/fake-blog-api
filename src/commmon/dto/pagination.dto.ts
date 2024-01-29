import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';


export class PaginationDto {

    @ApiProperty({
        default: 10, description: 'How many rows do you need',
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
        default: 0, description: 'How many rows do you want to skip',
        required: false,
        minimum: 0
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number;

}