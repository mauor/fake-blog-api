import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { Category } from './entities/category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category
        ]),
        AuthModule
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService]
})
export class CategoriesModule {}
