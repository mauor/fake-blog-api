import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ResponseMessages } from '../constants/responseMessages';


export function PatchResponses() {

    return applyDecorators(
        ApiOkResponse( { description: ResponseMessages.UPDATED } ),
        ApiBadRequestResponse( { description: ResponseMessages.BAD_REQUEST }),
        ApiUnauthorizedResponse( { description: ResponseMessages.UNAUTHORIZED } ),
        ApiNotFoundResponse( { description: ResponseMessages.NOT_FOUND } ),
        ApiInternalServerErrorResponse( { description: ResponseMessages.INTERNAL_SERVER_ERROR } ),
    );

}