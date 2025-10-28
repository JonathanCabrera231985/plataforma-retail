// apps/inventory-service/src/products/dto/create-product.dto.ts

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @IsUUID() // Validamos que sea un UUID válido
  @IsNotEmpty()
  categoryId: string; // Recibiremos el ID de la categoría
}