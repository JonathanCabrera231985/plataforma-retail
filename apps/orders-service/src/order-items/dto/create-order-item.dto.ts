import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID, Min, ValidateNested } from 'class-validator';
import { CreateOrderItemCustomizationDto } from '../../order-item-customizations/dto/create-order-item-customization.dto';
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

  // --- AÑADIR ESTAS LÍNEAS ---
  @IsArray()
  @IsOptional() // Un ítem puede o no tener personalizaciones
  @ValidateNested({ each: true }) // Valida cada objeto en el array
  @Type(() => CreateOrderItemCustomizationDto) // Le dice a class-validator qué DTO usar
  customizations?: CreateOrderItemCustomizationDto[];
  // -------------------------
}