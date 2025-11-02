// apps/store-operations-service/src/access-logs/dto/update-access-log.dto.ts

import { IsEnum, IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import { AccessStatus } from '../enums/access-status.enum';

export class UpdateAccessLogDto {
  @IsUUID()
  @IsNotEmpty()
  approvingUserId: string; // ID del Dueño-Tienda que aprueba/rechaza

  @IsEnum(AccessStatus)
  @IsNotEmpty()
  @IsIn([AccessStatus.APPROVED, AccessStatus.REJECTED]) // Solo permite estos dos estados
  status: AccessStatus.APPROVED | AccessStatus.REJECTED;
}