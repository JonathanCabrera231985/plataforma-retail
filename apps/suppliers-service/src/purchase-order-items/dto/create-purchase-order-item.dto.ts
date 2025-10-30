// apps/suppliers-service/src/purchase-order-items/dto/create-purchase-order-item.dto.ts
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min, MaxLength } from 'class-validator';

export class CreatePurchaseOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string; // ID del producto del inventory-service

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  productName: string; // Nombre del producto (denormalizado)

  @IsInt()
  @IsPositive()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  costPerItem: number; // Costo al proveedor
}