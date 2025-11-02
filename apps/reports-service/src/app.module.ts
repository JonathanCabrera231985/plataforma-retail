// apps/reports-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // 1. Importar TypeOrmModuleOptions
import { SalesReportsModule } from './sales-reports/sales-reports.module'; // Asegúrate de importar tus módulos de reportes
import { InventoryReportsModule } from './inventory-reports/inventory-reports.module'; // Asegúrate de importar tus módulos de reportes
import { SuppliersReportsModule } from './suppliers-reports/suppliers-reports.module';
import { StoreOpsReportsModule } from './store-ops-reports/store-ops-reports.module';

// 2. Función auxiliar con tipo de retorno explícito
const createDbConfig = (
  configService: ConfigService,
  name: string,
  dbEnvVar: string,
): TypeOrmModuleOptions => ({
  name: name,
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>(dbEnvVar),
  // entities: [], // <-- ELIMINA ESTA LÍNEA
  autoLoadEntities: true, // <-- CAMBIA ESTO A TRUE
  synchronize: false, // ¡Muy importante que sea false!
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
      useFactory: (config: ConfigService) =>
        createDbConfig(config, 'iam_connection', 'DB_NAME_IAM'),
    }),

    // Conexión a la BD de Inventario
    TypeOrmModule.forRootAsync({
      name: 'inventory_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDbConfig(config, 'inventory_connection', 'DB_NAME_INVENTORY'),
    }),

    // Conexión a la BD de Órdenes
    TypeOrmModule.forRootAsync({
      name: 'orders_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDbConfig(config, 'orders_connection', 'DB_NAME_ORDERS'),
    }),

    // Conexión a la BD de Proveedores
    TypeOrmModule.forRootAsync({
      name: 'suppliers_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDbConfig(config, 'suppliers_connection', 'DB_NAME_SUPPLIERS'),
    }),

    // Conexión a la BD de Operaciones de Tienda
    TypeOrmModule.forRootAsync({
      name: 'store_ops_connection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDbConfig(config, 'store_ops_connection', 'DB_NAME_STORE_OPS'),
    }),

    // Módulos de reportes
    SalesReportsModule,
    InventoryReportsModule,
    SuppliersReportsModule,
    StoreOpsReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}