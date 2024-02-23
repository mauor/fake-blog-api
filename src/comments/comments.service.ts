import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger('CommentsService');
    constructor(
        @InjectRepository( Comment )
        private readonly commentRepository: Repository<Comment>,
    ){}
    async create(createCommentDto: CreateCommentDto, user: User) {
        try{
            const comment = this.commentRepository.create( {
                ...createCommentDto,
                user: {
                    user_id: user.user_id
                },
                post: {
                    post_id: createCommentDto.post_id
                }
            } );
            await this.commentRepository.save( comment );
            return comment;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0, order = 'ASC' } = paginationDto;
        const comments = await this.commentRepository.find( {
            take: limit,
            skip: offset,
            order: { create_date: order } ,
        } );
        if( !comments.length ) throw new NotFoundException(`Comments not found with limit: ${ limit } and offset: ${ offset }.`)
        return comments;
    }

    async findOne( comment_id: string ) {
        const comment = await this.commentRepository.findOneBy( { comment_id } );
        if( !comment ) throw new NotFoundException(`Comment not found with id: ${ comment_id } .`)
        return comment;
    }

    async update(comment_id: string, updateCommentDto: UpdateCommentDto) {
        const comment = await this.commentRepository.preload( {
            ...updateCommentDto,
            comment_id
        })
        if(! comment ) throw new NotFoundException(`Comment not found with id: ${ comment_id }.`)
        try{
            await this.commentRepository.save(comment);
            return;
        }
        catch( error ) {
            this.handleExceptionsDB( error );
        }
    }

    async remove(comment_id: string) {
        const comment = await this.findOne( comment_id );
        await this.commentRepository.delete( comment );
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
