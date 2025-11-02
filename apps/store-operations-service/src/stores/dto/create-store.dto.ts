// apps/store-operations-service/src/stores/dto/create-store.dto.ts

import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsUUID() // Validamos que sea un UUID
  @IsNotEmpty()
  ownerUserId: string; // El ID del usuario (del iam-service) dueño de la tienda

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}