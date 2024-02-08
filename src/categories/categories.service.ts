import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';

@Injectable()
export class CategoriesService {
    
    private readonly logger = new Logger('Categories Service');

    constructor(
        @InjectRepository( Category )
        private readonly categoryRepository: Repository<Category>
    ){}

    async create(createCategoryDto: CreateCategoryDto) {
        try{
            const category =  await this.categoryRepository.create( createCategoryDto );
            await this.categoryRepository.save( category );
            return category;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }
        return 'This action adds a new category';
    }

    async findAll( paginationDto: PaginationDto ) {
        const { limit = 10, offset = 0 , order = 'ASC' } = paginationDto;
        const categories = await this.categoryRepository.find( {
            take: limit,
            skip: offset,
            order: { category: order }
        } );

        if( !categories ) throw new NotFoundException(`Categories not found with limit: ${ limit } and offset: ${ offset }.`)
        return categories;
    }

    async findOne(term: string) {
        let category: Category;
        if( isUUID( term ) ){
            category = await this.categoryRepository.findOneBy( { category_id: term });
        }
        else{
            category = await this.categoryRepository.findOneBy( { category: term } )
        }
        if( !category ) throw new NotFoundException(`Category with term: ${ term } not found.`);
        return category;
    }

    async update(category_id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.preload( { category_id, ...updateCategoryDto} );
        if( ! category ) throw new NotFoundException(`Category with id ${ category_id } not found.`);
        try{
            await this.categoryRepository.save( category );
            return;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }
    }

    async remove(category_id: string) {
        const category = await this.findOne( category_id );
        await this.categoryRepository.softRemove( category );
    }

    handleExceptionsDB(error: any) {
        if(error.code === '23505') throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpexted error, check server logs.');
    }
}
