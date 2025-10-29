// apps/iam-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Importar Config
import { TypeOrmModule } from '@nestjs/typeorm'; // 2. Importar TypeOrm

@Module({
  imports: [
    // 3. Añadir Configuración Global de .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Asegúrate que .env exista en apps/iam-service
    }),

    // 4. Añadir Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule aquí también
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // Lee del .env de iam-service
        port: configService.get<number>('DB_PORT'), // Lee del .env de iam-service
        username: configService.get<string>('DB_USERNAME'), // Lee del .env de iam-service
        password: configService.get<string>('DB_PASSWORD'), // Lee del .env de iam-service
        database: configService.get<string>('DB_DATABASE'), // Lee del .env de iam-service
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-detecta entidades
        synchronize: true, // Solo para desarrollo
      }),
    }),

    // Módulos existentes
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}