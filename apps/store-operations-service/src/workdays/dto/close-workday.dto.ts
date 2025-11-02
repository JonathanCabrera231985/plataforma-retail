// apps/store-operations-service/src/workdays/dto/close-workday.dto.ts

import { IsNotEmpty, IsUUID } from 'class-validator';

export class CloseWorkdayDto {
  @IsUUID()
  @IsNotEmpty()
  closedByUserId: string; // ID del Staff-Tienda que cierra
}