// apps/orders-service/src/orders/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string; // ID del usuario que compra

  @IsUUID()
  @IsNotEmpty()
  locationId: string; // ID de la tienda donde se vende

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada ítem del array
  @Type(() => CreateOrderItemDto) // Especifica el tipo del DTO anidado
  @IsNotEmpty()
  items: CreateOrderItemDto[];
}