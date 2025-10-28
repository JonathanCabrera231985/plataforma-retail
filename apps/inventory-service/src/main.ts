// apps/inventory-service/src/main.ts
import 'reflect-metadata'; // <-- ADD THIS LINE
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtenemos el servicio de configuración
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001; // Lee el puerto del .env

  // Habilitamos la validación (la necesitaremos pronto)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(port);
  console.log(`InventoryService está corriendo en el puerto ${port}`);
}
bootstrap();