// apps/store-operations-service/src/access-logs/dto/create-access-log.dto.ts

import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAccessLogDto {
  @IsUUID()
  @IsNotEmpty()
  storeId: string; // ID de la tienda a la que se ingresa

  @IsUUID()
  @IsNotEmpty()
  mfUserId: string; // ID del usuario "Maria Fernanda" que ingresa

  @IsString()
  @IsOptional()
  @MaxLength(255)
  purpose?: string; // Motivo de la visita
}