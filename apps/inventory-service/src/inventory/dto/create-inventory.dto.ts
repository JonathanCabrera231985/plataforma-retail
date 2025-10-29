// apps/inventory-service/src/inventory/dto/create-inventory.dto.ts

import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @IsInt() // La cantidad debe ser un número entero
  @Min(0) // La cantidad no puede ser negativa
  @IsNotEmpty()
  quantity: number;
}