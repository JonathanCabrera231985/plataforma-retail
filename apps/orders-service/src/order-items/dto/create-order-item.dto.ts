// apps/orders-service/src/order-items/dto/create-order-item.dto.ts
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  priceAtPurchase: number; // El precio al que se vendió
}