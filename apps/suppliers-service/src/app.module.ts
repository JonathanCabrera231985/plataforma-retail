// apps/suppliers-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PurchaseOrderItemsModule } from './purchase-order-items/purchase-order-items.module';
import { PaymentsModule } from './payments/payments.module';
// 1. Importar Passport y la Estrategia
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

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

    SuppliersModule,

    PurchaseOrdersModule,

    PurchaseOrderItemsModule,

    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy, // 4. Añadir JwtStrategy como provider
  ],
})
export class AppModule {}