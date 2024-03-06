import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../interface/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';


export function Auth(...roles: Role[]) {

    return applyDecorators(
        Roles(...roles),
        UseGuards( AuthGuard(), RolesGuard),
        ApiBearerAuth(),
    );

}