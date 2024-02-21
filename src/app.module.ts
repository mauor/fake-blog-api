import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './commmon/common.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true
        }),
        ServeStaticModule.forRoot({
            serveRoot: '/api/static/uploads/', // Path where the static files will be served.
            rootPath: join(__dirname, '..', '/static/uploads/'), // Path that contains the static files
        }),
        UsersModule,
        CommonModule,
        AuthModule,
        CategoriesModule,
        CommentsModule,
        PostsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}