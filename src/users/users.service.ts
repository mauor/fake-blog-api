import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto/index';
import { PaginationDto } from 'src/commmon/dto/pagination.dto';

import * as bcrypt from 'bcrypt';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UsersService {

    private readonly logger = new Logger('Users Service');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,    
    ){}
    
    async create(createUserDto: CreateUserDto) {
        try{
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

            const user = this.userRepository.create( createUserDto );
            await this.userRepository.save( user );
            return user;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }

    }
    
    async findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0 , order = 'ASC' } = paginationDto;

        const users = await this.userRepository.find({
            take: limit,
            skip: offset,
            order: { first_name: order }
        })
        if(!users.length) throw new NotFoundException(`Users not found with limit: ${ limit } and offset: ${ offset }.`)
        return users;
    }
    
    async findOne(term: string) {
        let user: User;
        if(isUUID( term )){
            user = await this.userRepository.findOneBy({ user_id: term });
        }
        else{
            user = await this.userRepository.findOneBy({ email: term });
        }
        if ( !user ) 
            throw new NotFoundException(`User with ${ term } not found.`);

        return user;
    }
    
    async update(user_id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.preload({user_id, ...updateUserDto});
        if ( !user ) throw new NotFoundException(`User with id: ${ user_id } not found.`);
        try{
            await this.userRepository.save( user );
            return user;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }
    }
    
    async updatePassword(user_id: string, updateUserPasswordDto: UpdateUserPasswordDto) {    
        const user = await this.userRepository.findOne( {
            where: { user_id },
            select: { email: true, password: true, user_id: true }
        } );

        if ( !bcrypt.compareSync( updateUserPasswordDto.old_password, user.password ) )
            throw new UnauthorizedException('Credentials are not valid (password).');
        user.password = bcrypt.hashSync( updateUserPasswordDto.password, 10 );

        try{
            await this.userRepository.save( user );
            return;
        }
        catch( error ){
            this.handleExceptionsDB( error );
        }
    }

    async remove(user_id: string) {
        const user = await this.findOne( user_id );
        await this.userRepository.softDelete( user.user_id );
    }
    
    handleExceptionsDB(error: any) {
        if(error.code === '23505') throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpexted error, check server logs.');
    }
}
