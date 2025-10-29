// apps/inventory-service/src/locations/dto/create-location.dto.ts

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string; // Ej: "Bodega Central", "Tienda Guayaquil"

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  description?: string;
}