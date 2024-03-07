import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { initialData } from 'src/seed/data/seed-data';

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
        await this.insertUsers();
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
        const seed_users = initialData.users;
        const users: User[] = [];
        seed_users.forEach( user => {
            users.push( this.userRepository.create( user ) );
        });
        const db_users = await this.userRepository.save( users );
        console.log( db_users );
        return;
    }

    handleExceptionsDB(error: any) {
        if(error.code === '23505') throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpexted error, check server logs.');
    }
}
