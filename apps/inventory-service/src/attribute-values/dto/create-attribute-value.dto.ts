// apps/inventory-service/src/attribute-values/dto/create-attribute-value.dto.ts

import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value: string; // Ej: "Rojo", "5cm", "Cuero"

  @IsUUID()
  @IsNotEmpty()
  attributeId: string; // ID del atributo padre (ej. el ID de "Color")
}