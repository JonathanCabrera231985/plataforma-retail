// apps/orders-service/src/auth/strategies/jwt.strategy.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
        'No se ha definido JWT_SECRET en el archivo .env de orders-service',
      );
    }

    // 3. Llamar a super()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // Esta estrategia solo valida el token y adjunta el payload
  async validate(payload: JwtPayload) {
    // No necesitamos verificar si el usuario existe en la BD de órdenes
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}