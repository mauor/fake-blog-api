import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { User } from "src/users/entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity( { name:'Post' } )
export class Post {

    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        example: `3a9c732f-fb5d-4a72-b5f9-bb5354932e01`,
        description: 'Unique identifier assigned to each post within a system.',
        uniqueItems: true,
    })
    post_id: string;

    @ApiProperty({
        example: `Unveiling Nature's Wonders: Journey through the Marvels of the Natural World.`,
        description: 'Title unique for the post.',
        uniqueItems: true,
        minLength: 3,
        maxLength: 255
    })
    @Column('varchar', { unique: true, length: 255, nullable: false })
    title: string;

    @ApiProperty({
        example: `Embark on a captivating journey through the most remote and astonishing corners of our planet, where natural beauty unfolds in all its majesty. From the depths of the ocean to the peaks of the highest mountains, this narrative will take you to places where life flourishes in remarkable ways, and diversity reigns supreme. Join us on this expedition and be enthralled by the infinite variety of landscapes, flora, and fauna that our world has to offer.`,
        description: 'Content of the post.',
    })
    @Column('text', { nullable: false })
    article: string;

    @ApiPropertyOptional({
        description: 'Name of the image of the post.',
    })
    @Column('text', { nullable: true })
    image_url?: string;

    @Column('text', { nullable: true } )
    @ApiPropertyOptional({
        example: 'Some description.',
        description: 'Short description abot the content of the article.',
        nullable: true,
    })
    description?: string;

    @CreateDateColumn()
    create_date: Date;

    @UpdateDateColumn()
    update_date: Date;

    @ManyToOne(
        () => Category,
        ( category ) => category.post,
        {
            nullable: false,
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'category_id', 
        referencedColumnName: 'category_id',
    })
    @ApiProperty({
        type: () => Category,
        description: 'Unique identifier assigned to each category within a system. his serves tu reference to the category of the article.',
    })
    category: Category;

    @ManyToOne(
        () => User, 
        ( user ) => user.post,
        {
            nullable: false,
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'user_id', 
        referencedColumnName: 'user_id',
    })
    @ApiProperty({
        type: () => User,
        description: 'Unique identifier assigned to each user within a system. This serves as a distinctive reference to distinguish one user from another.',
    })
    user: User;

    @OneToMany(
        () => Comment,
        ( comment ) => comment.post
    )
    comment: Comment[];
}
