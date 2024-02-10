import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "src/users/entities/user.entity";
import { Post } from "src/posts/entities/post.entity";

@Entity({name: 'Comment'})
export class Comment {
    
    @PrimaryGeneratedColumn('uuid')
    comment_id: string;

    @Column('text', { nullable: false } )
    comment: string;

    @CreateDateColumn()
    create_date: Date;

    @UpdateDateColumn()
    delete_date: Date;

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
