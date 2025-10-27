// apps/iam-service/src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

// Definimos el tipo del payload que esperamos del token
type JwtPayload = {
  sub: string; // ID del usuario
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService, // Inyectamos UsersService
  ) {
    super({
      // 1. Dónde buscar el token (en el encabezado Bearer)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. No ignorar si el token expiró
      ignoreExpiration: false,
      // 3. El mismo secreto que usamos para firmar el token
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Este método se llama después de que Passport verifica la firma del token.
   * El 'payload' es el objeto que pusimos en el token al hacer login.
   */
  async validate(payload: JwtPayload) {
    // 4. (Opcional pero recomendado)
    // Verificamos si el usuario (sub) todavía existe en la BD
    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido o usuario inactivo');
    }

    // 5. Lo que retornemos aquí será inyectado en el objeto 'request.user'
    // del controlador.
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}