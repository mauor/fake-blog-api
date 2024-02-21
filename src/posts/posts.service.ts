import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import * as fs from 'fs';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { Category } from 'src/categories/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {

    private readonly logger = new Logger('PostsService');

    constructor(
        @InjectRepository( Post )
        private readonly postRepository: Repository<Post>,
        private readonly configService: ConfigService
    ) {};
    async create(createPostDto: CreatePostDto, user: User, file: Express.Multer.File) {
        try{ 
            const category = new Category;
            category.category_id = createPostDto.category_id;
            createPostDto.image_url = `${this.configService.get<string>('HOST_API')}/static/uploads/${file.filename}`;
            const post = this.postRepository.create({ ...createPostDto, user, category });
            await this.postRepository.save(post);
            return post;
        }
        catch( error ){
            if( fs.existsSync(file.path) ) fs.unlinkSync(file.path);
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

    async findOne( term: string ) {
        let post: Post;
        if( isUUID( term ) ){
            post = await this.postRepository.findOneBy( { post_id: term } );
        }
        else{
            post = await this.postRepository.findOneBy( { title: term } )
        }
        if( !post ) throw new NotFoundException(`Post with term: ${ term } not found.`);
        return post;
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
