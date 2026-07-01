// apps/iam-service/src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseJwtStrategy, JwtPayload } from '@retail/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends BaseJwtStrategy {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super(configService);
  }

  override async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido o usuario inactivo');
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}