// apps/inventory-service/src/auth/strategies/jwt.strategy.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// ... (definición de JwtPayload) ...
type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // 1. Obtener el secreto ANTES de llamar a super()
    const secret = configService.get<string>('JWT_SECRET');

    // 2. Validar que el secreto existe
    if (!secret) {
      throw new InternalServerErrorException(
        'No se ha definido JWT_SECRET en el archivo .env de inventory-service',
      );
    }

    // 3. Llamar a super() con el secreto validado
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // <-- Ahora es un string definido
    });
  }

  // ... (método validate) ...
  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}