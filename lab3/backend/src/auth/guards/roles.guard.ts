import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: string } }>();
    const userRole = request.user?.role;

    if (!userRole) {
      throw new ForbiddenException('Недостатньо прав доступу.');
    }

    const normalizedUserRole = normalizeRole(userRole);
    const normalizedRequiredRoles = requiredRoles.map(normalizeRole);

    if (!normalizedRequiredRoles.includes(normalizedUserRole)) {
      throw new ForbiddenException('Недостатньо прав доступу.');
    }

    return true;
  }
}

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}
