// apps/store-operations-service/src/rental-payments/dto/mark-as-paid.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class MarkAsPaidDto {
  @IsString()
  @IsOptional()
  notes?: string; // Opcional: para referencia de transacción
}