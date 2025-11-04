// apps/orders-service/src/order-item-customizations/dto/create-order-item-customization.dto.ts

import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOrderItemCustomizationDto {
  @IsUUID()
  @IsNotEmpty()
  attributeId: string; // ID del atributo (ej. "Color")

  @IsUUID()
  @IsNotEmpty()
  valueId: string; // ID del valor (ej. "Rojo")

  // Opcional: El frontend puede enviar los nombres para denormalizar
  @IsString()
  @IsOptional()
  @MaxLength(100)
  attributeName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  valueName?: string;
}