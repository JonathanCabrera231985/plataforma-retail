// apps/store-operations-service/src/workdays/dto/create-workday.dto.ts

import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWorkdayDto {
  @IsUUID()
  @IsNotEmpty()
  storeId: string; // ID de la tienda que abre la jornada

  @IsUUID()
  @IsNotEmpty()
  openedByUserId: string; // ID del Staff-Tienda que la abre
}