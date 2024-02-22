import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "src/users/entities/user.entity";
import { Post } from "src/posts/entities/post.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'Comment'})
export class Comment {
    
    @ApiProperty({
        example: `3a9c732f-fb5d-4a72-b5f9-bb5354932e01`,
        description: 'Unique identifier assigned to each comment within a system.',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    comment_id: string;

    @ApiProperty({
        example: `Nice post.`,
        description: 'Content of the comment.',
    })
    @Column('text', { nullable: false } )
    comment: string;

    @ApiProperty({
        example: '2024-01-01 01:00:00.000000',
        description: 'Timestamp indicating the date and time when the comment was created.',
    })
    @CreateDateColumn()
    create_date: Date;

    @ApiProperty({
        example: '2024-01-01 01:00:00.000000',
        description: 'Timestamp indicating the date and time when the comment was updated or marked for deletion within the system.',
    })
    @UpdateDateColumn()
    update_date: Date;

    @ApiProperty({
        type: () => User,
        description: 'Unique identifier assigned to each user within a system.',
    })
    @ManyToOne(
        () => User, 
        ( user ) => user.comment,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'user_id', 
        referencedColumnName: 'user_id'
    })
    user: User

    @ApiProperty({
        type: () => Post,
        description: 'Unique identifier assigned to each post within a system.',
    })
    @ManyToOne(
        () => Post, 
        ( post ) => post.comment,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'post_id', 
        referencedColumnName: 'post_id'
    })
    post: Post

}
