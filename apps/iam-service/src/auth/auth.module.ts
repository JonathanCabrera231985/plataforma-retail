// apps/iam-service/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'; // 1. Importar Passport
import { JwtStrategy } from './strategies/jwt.strategy'; // 2. Importar nuestra Estrategia

@Module({
  imports: [
    UsersModule,
    // 3. Registrar Passport, definiendo 'jwt' como la estrategia por defecto
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  // 4. Añadir AuthService y JwtStrategy a los providers
  providers: [AuthService, JwtStrategy], 
})
export class AuthModule {}