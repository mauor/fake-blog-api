import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ResponseMessages } from '../constants/responseMessages';


export function GetResponses( type: Type<unknown> ,  isArray: boolean = false) {

    let name = type.name;
    if( name.substring(name.length - 1 ) === 'y' && isArray )
        name = name.substring(0, name.length - 1) + 'ies';
   
    return applyDecorators(
        ApiOperation( { summary: `Finds the ${ name }${ (isArray) ? '.': ' by term.' }` } ),
        ApiOkResponse( { description: ResponseMessages.SUCCESS, type: type, isArray: isArray } ),
        ApiBadRequestResponse( { description: ResponseMessages.BAD_REQUEST }),
        ApiUnauthorizedResponse( { description: ResponseMessages.UNAUTHORIZED } ),
        ApiNotFoundResponse( { description: ResponseMessages.NOT_FOUND } ),
        ApiInternalServerErrorResponse( { description: ResponseMessages.INTERNAL_SERVER_ERROR } ),
    );

}