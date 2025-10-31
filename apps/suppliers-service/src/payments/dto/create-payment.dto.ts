// apps/suppliers-service/src/payments/dto/create-payment.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity'; // Importa el Enum

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  purchaseOrderId: string; // ID de la orden de compra a la que se abona

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive() // El monto debe ser positivo
  @IsNotEmpty()
  amount: number; // Monto del abono

  @IsEnum(PaymentMethod)
  @IsOptional() // Opcional, usará el default de la entidad si no se envía
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;
}