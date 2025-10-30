// apps/suppliers-service/src/purchase-orders/dto/create-purchase-order.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreatePurchaseOrderItemDto } from '../../purchase-order-items/dto/create-purchase-order-item.dto';

export class CreatePurchaseOrderDto {
  @IsUUID()
  @IsNotEmpty()
  supplierId: string; // ID del proveedor

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada ítem del array
  @Type(() => CreatePurchaseOrderItemDto) // Especifica el tipo del DTO anidado
  @IsNotEmpty()
  items: CreatePurchaseOrderItemDto[];
}