
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '../interface/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required_roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!required_roles) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const user: User = req.user;

        if(!user) throw new BadRequestException('User not found.');
        required_roles.some((role) => {
            if(user.role?.includes(role)) return true;
        });
        
        throw new ForbiddenException(`User with id: ${user.user_id} does have a valid role: [${ required_roles }]`)
    }
}
