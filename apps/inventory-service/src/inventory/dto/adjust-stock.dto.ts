// apps/inventory-service/src/inventory/dto/adjust-stock.dto.ts

import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class AdjustStockDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @IsInt()
  @IsPositive() // La cantidad a ajustar debe ser mayor que cero
  @IsNotEmpty()
  amount: number; // Cantidad a sumar o restar
}