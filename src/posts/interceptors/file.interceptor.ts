import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ValidationError, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as fs from 'fs';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const dto = plainToClass(CreatePostDto, request.body); 

        try {
            await validateOrReject(dto);
            return next.handle();
        } catch (errors) {
            // Eliminar el archivo si ya se había guardado
            if (request.file && fs.existsSync(request.file.path)) {
                fs.unlinkSync(request.file.path);
            }
            // Devolver errores específicos de class-validator
            const validationErrors: ValidationError[] = errors;
            const errorMessages = this.flattenValidationErrors(validationErrors);

            throw new BadRequestException(errorMessages);
        }
    }
    private flattenValidationErrors(validationErrors: ValidationError[]): string[] {
        const errorMessages: string[] = [];
        validationErrors.forEach(error => {
            Object.values(error.constraints).forEach(message => {
                errorMessages.push(message);
            });
        });
        return errorMessages;
    }
}

