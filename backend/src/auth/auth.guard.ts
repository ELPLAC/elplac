import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 1. Omitir la validación de token si la petición es un Preflight de CORS (OPTIONS)
    if (request.method === 'OPTIONS') {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(
        'Token no encontrado en el encabezado Authorization',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });
      request.user = payload;
      return true;
    } catch (error) {
      // 2. Usar UnauthorizedException (401) en lugar de HTTP 500 para fallos de JWT
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}