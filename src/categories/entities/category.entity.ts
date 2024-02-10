import { ApiProperty } from "@nestjs/swagger";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Post } from "src/posts/entities/post.entity";

@Entity({name: 'Category'})
export class Category {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Unique identifier assigned to each category within a system.',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    category_id: string;

    @ApiProperty({
        example: 'Tecnology',
        description: 'Name of the category.',
        uniqueItems: true
    })
    @Column('varchar', { unique: true, length: 255, nullable: false } )
    category: string;

    @ApiProperty({
        example: 'Category that talks about technological topics.',
        description: 'Description of the category.',
        nullable: true
    })
    @Column('text', { nullable: true } )
    description?: string;

    @ApiProperty({
        example: '2024-01-01 01:00:00.000000',
        description: 'Timestamp indicating the date and time when the category was deleted or marked for deletion within the system.',
    })
    @DeleteDateColumn()
    delete_date?: Date;

    @OneToMany(
        () => Post,
        ( post ) => post.category
    )
    post: Post[];
}
