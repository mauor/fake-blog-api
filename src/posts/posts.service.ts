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
            if(file) createPostDto.image_url = `${this.configService.get<string>('HOST_API')}/static/uploads/${file.filename}`;

            const post = this.postRepository.create({ 
                ...createPostDto, 
                user, 
                category: {
                    category_id: createPostDto.category_id
                } 
            });
            await this.postRepository.save( post );
            return post;
        }
        catch( error ){
            if( file && fs.existsSync(file.path) ) fs.unlinkSync(file.path);
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
            post = await this.postRepository.findOne( { 
                where: { post_id: term },
                relations: ['category', 'user']
            } );
        }
        else{
            post = await this.postRepository.findOne( { 
                where: {title: term},
                relations: ['category', 'user'],
            } )
        }
        if( !post ) throw new NotFoundException(`Post with term: ${ term } not found.`);
        return post;
    }

    async update(post_id: string, updatePostDto: UpdatePostDto, file: Express.Multer.File) {
        try{
            if( file ){
                updatePostDto.image_url = `${this.configService.get<string>('HOST_API')}/static/uploads/${file.filename}`;
                await this.unlinkFile( post_id );
            }
            const post = this.postRepository.create({
                ...updatePostDto, 
                post_id,
                category: {
                    category_id: updatePostDto.category_id
                }  
            });
            await this.postRepository.save(post);
            return;
        }
        catch( error ){
            if( file && fs.existsSync(file.path) ) fs.unlinkSync(file.path);
            this.handleExceptionsDB( error );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }

    async unlinkFile(post_id: string) {
        const post = await this.findOne( post_id );
        
        if( post.image_url ){
            const filename = post.image_url.split('/').at(-1);
            if ( fs.existsSync( `static/uploads/${filename}` ) ) fs.unlinkSync(  `static/uploads/${filename}` ); 
        }
        return;
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
