// apps/inventory-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
// No need to import Category entity here anymore if using auto-detect

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Restore forRootAsync, but add ConfigModule to its imports
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // <--- Add this line back
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ // Keep async removed for now
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

    CategoriesModule,

    ProductsModule,

    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}