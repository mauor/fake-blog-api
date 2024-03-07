import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SeedComment, SeedPost, initialData } from 'src/seed/data/seed-data';

@Injectable()
export class SeedService {
    private readonly logger = new Logger('SeedService');
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    async runSeed(){
        await this.deleteTables();
        const dbUsers: User[] = await this.insertUsers();
        await this.insertCategories( dbUsers);
        return; 
    }

    private async deleteTables(){
        Promise.all([
            this.commentRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute(),
            this.postRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute(),
            this.categoryRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute(),
            this.userRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute(),
        ])
        .then(() => {
            return;
        })
        .catch(( error ) => {
            this.handleExceptionsDB( error );
        });   
    }

    private async insertUsers(){
        const seedUsers = initialData.users;
        const users: User[] = [];
        seedUsers.forEach( user => {
            users.push( this.userRepository.create( user ) );
        });
        return await this.userRepository.save( users );
    }

    private async insertCategories(dbUsers: User[]){
        const seedCategories = initialData.categories;

        for (const [index, seedCategory] of seedCategories.entries()) {
            const seedPosts = seedCategories[ index ].posts;
            const category = this.categoryRepository.create( seedCategory );    
           
            this.insertPosts( 
                seedPosts, 
                dbUsers, 
                await this.categoryRepository.save( category )
            );
        }
        return;
    }

    private async insertPosts( seedPosts: SeedPost[], dbUsers: User[], category: Category ){
        const user = dbUsers[ Math.floor(Math.random() * dbUsers.length) ];
        for (const [index, seedPost] of seedPosts.entries()) {
            const seedComments = seedPosts[ index ].comments;
            const post = this.postRepository.create( { ...seedPost, user, category } );

            this.insertComments( 
                seedComments,
                dbUsers,
                await this.postRepository.save( post )
            );
        };
        return;
    }

    private async insertComments( seedComments: SeedComment[], dbUsers: User[], post: Post ){
        const comments: Comment[] = [];
        const user = dbUsers[ Math.floor(Math.random() * dbUsers.length) ];
        seedComments.forEach( comment => {
            comments.push( this.commentRepository.create( { ...comment, user, post } ) );
        });
        return await this.commentRepository.save( comments );
    }

    handleExceptionsDB(error: any) {
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpexted error, check server logs.');
    }
}
