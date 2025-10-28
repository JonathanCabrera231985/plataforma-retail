// apps/iam-service/src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos del decorador @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si no se especifican roles (@Roles no se usó), permitir el acceso
    if (!requiredRoles) {
      return true;
    }

    // 3. Obtener el usuario del token (que fue puesto por el AuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 4. Comprobar si el rol del usuario está en la lista de roles requeridos
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}