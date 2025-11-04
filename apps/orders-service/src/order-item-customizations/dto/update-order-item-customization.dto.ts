import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemCustomizationDto } from './create-order-item-customization.dto';

export class UpdateOrderItemCustomizationDto extends PartialType(CreateOrderItemCustomizationDto) {}
