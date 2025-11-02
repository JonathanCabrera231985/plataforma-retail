// apps/reports-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Función auxiliar para generar la configuración de conexión
const createDbConfig = (configService: ConfigService, name: string, dbEnvVar: string) => ({
  name: name, // Nombre único para la conexión
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>(dbEnvVar), // Variable .env específica
  entities: [], // Definiremos entidades de solo lectura por módulo
  autoLoadEntities: false, // No cargar entidades automáticamente
  synchronize: false, // ¡MUY IMPORTANTE! Nunca sincronizar un servicio de reportes
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Conexión a la BD de IAM
    TypeOrmModule.forRootAsync({
      name: 'iam_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDbConfig(config, 'iam_connection', 'DB_NAME_IAM'),
    }),

    // Conexión a la BD de Inventario
    TypeOrmModule.forRootAsync({
      name: 'inventory_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDbConfig(config, 'inventory_connection', 'DB_NAME_INVENTORY'),
    }),

    // Conexión a la BD de Órdenes
    TypeOrmModule.forRootAsync({
      name: 'orders_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDbConfig(config, 'orders_connection', 'DB_NAME_ORDERS'),
    }),

    // Conexión a la BD de Proveedores
    TypeOrmModule.forRootAsync({
      name: 'suppliers_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDbConfig(config, 'suppliers_connection', 'DB_NAME_SUPPLIERS'),
    }),

    // Conexión a la BD de Operaciones de Tienda
    TypeOrmModule.forRootAsync({
      name: 'store_ops_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDbConfig(config, 'store_ops_connection', 'DB_NAME_STORE_OPS'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}