import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';

@Injectable()
export class PostsService {

    private readonly logger = new Logger('PostsService');

    constructor(
        @InjectRepository( Post )
        private readonly postRepository: Repository<Post>
    ) {};
    async create(createPostDto: CreatePostDto, user: User) {
        try{
            const category = new Category;
            category.category_id = createPostDto.category_id;
            const post = this.postRepository.create({ ...createPostDto, user, category });
            await this.postRepository.save(post);
            return post;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }
    }
    async findAll(paginationDto: PaginationDto) {
        const posts = await this.postRepository.find({
            take: paginationDto.limit,
            skip: paginationDto.offset,
            order: { create_date: paginationDto.order },
            relations: ['category', 'user']
        });
        return posts;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }

    private handleExceptionsDB(error: any) {
        //Key don´t exist
        if(error.code === '23503') throw new BadRequestException(error.detail);
        this.logger.error(error);
        //Key already exist
        if(error.code === '23505') throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpexted error, check server logs.');
    }
}
