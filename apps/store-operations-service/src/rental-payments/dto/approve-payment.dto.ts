// apps/store-operations-service/src/rental-payments/dto/approve-payment.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApprovePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  approvedByMfUserId: string; // ID del usuario "Maria Fernanda" que aprueba
}