// apps/store-operations-service/src/workdays/dto/approve-workday.dto.ts

import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApproveWorkdayDto {
  @IsUUID()
  @IsNotEmpty()
  approvingUserId: string; // ID del Dueño-Tienda que aprueba
}