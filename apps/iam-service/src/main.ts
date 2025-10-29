// apps/iam-service/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importar

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Habilitar el pipe de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
    transform: true, // Transforma los tipos de datos (ej. string a number)
  }));

  await app.listen(3000);
  console.log(`InventoryService está corriendo en el puerto 3000`);
}
bootstrap();