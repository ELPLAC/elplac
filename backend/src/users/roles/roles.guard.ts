import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@users/roles/roles.enum";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest()

        if (requiredRoles.some((role) => user.role?.includes(role))) return true

        throw new NotFoundException ("Usuario no autorizado")
    }
}