// apps/inventory-service/src/categories/dto/create-category.dto.ts

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional() // La descripción es opcional
  description?: string;
}