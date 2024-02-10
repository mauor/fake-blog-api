import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { User } from "src/users/entities/user.entity";

@Entity( { name:'Post' } )
export class Post {

    @PrimaryGeneratedColumn('uuid')
    post_id: string;

    @Column('varchar', { unique: true, length: 255, nullable: false })
    title: string;

    @Column('text', { nullable: false })
    article: string;

    @Column('text', { nullable: true })
    photo_url?: string;

    @Column('text', { nullable: true } )
    description?: string;

    @CreateDateColumn()
    create_date: Date;

    @UpdateDateColumn()
    update_date: Date;

    @ManyToOne(
        () => Category,
        ( category ) => category.post,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'category_id', 
        referencedColumnName: 'category_id',
    })
    category: Category;

    @ManyToOne(
        () => User, 
        ( user ) => user.post,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'user_id', 
        referencedColumnName: 'user_id',
    })
    user: User

    @OneToMany(
        () => Comment,
        ( comment ) => comment.post
    )
    comment: Comment
}
