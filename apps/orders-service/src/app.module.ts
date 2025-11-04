// apps/orders-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PassportModule } from '@nestjs/passport'; // 1. Importar Passport
import { JwtStrategy } from './auth/strategies/jwt.strategy'; // 2. Importar la Estrategia
import { OrderItemCustomizationsModule } from './order-item-customizations/order-item-customizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule aquí
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Dev only
      }),
    }),
    // 3. Añadir PassportModule
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    OrdersModule,
    OrderItemsModule,
    OrderItemCustomizationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy, // 4. Añadir JwtStrategy como provider
  ],
})
export class AppModule {}