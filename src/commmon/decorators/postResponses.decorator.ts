import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ResponseMessages } from '../constants/responseMessages';


export function PostResponses( type: Type<unknown> ) {
    return applyDecorators(
        ApiOperation( { summary:  `Create a new ${type.name}.` } ),
        ApiCreatedResponse( { description: ResponseMessages.CREATED, type: type, isArray: false } ),
        ApiBadRequestResponse( { description: ResponseMessages.BAD_REQUEST } ),
        ApiUnauthorizedResponse( { description: ResponseMessages.UNAUTHORIZED } ),
        ApiInternalServerErrorResponse( { description: ResponseMessages.INTERNAL_SERVER_ERROR } ),
    );

}