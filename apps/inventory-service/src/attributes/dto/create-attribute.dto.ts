// apps/inventory-service/src/attributes/dto/create-attribute.dto.ts

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string; // Ej: "Color", "Altura de Taco"
}