// apps/store-operations-service/src/rental-payments/dto/create-rental-payment.dto.ts

import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsUUID, Max, Min } from 'class-validator';

export class CreateRentalPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  storeId: string; // ID de la tienda por la que se paga

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  amount: number; // Monto del alquiler

  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month: number; // Mes (1-12)

  @IsInt()
  @Min(2024) // Asumimos que no hay pagos anteriores a este año
  @IsNotEmpty()
  year: number; // Año (ej. 2025)
}