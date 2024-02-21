import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from 'src/posts/helpers';
import { ValidationInterceptor } from 'src/posts/interceptors/file.interceptor';

export function FileUpload( fieldname: string, maxSize: number = 1024 * 1024 * 2 ) {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor( fieldname, {
                limits: { fileSize: maxSize },
                fileFilter: fileFilter,
                storage: diskStorage({
                    destination: './static/uploads',
                    filename: fileNamer
                })
            }),
            ValidationInterceptor
        )
    );
}