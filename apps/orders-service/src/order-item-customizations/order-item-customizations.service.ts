import { Injectable } from '@nestjs/common';
import { CreateOrderItemCustomizationDto } from './dto/create-order-item-customization.dto';
import { UpdateOrderItemCustomizationDto } from './dto/update-order-item-customization.dto';

@Injectable()
export class OrderItemCustomizationsService {
  create(createOrderItemCustomizationDto: CreateOrderItemCustomizationDto) {
    return 'This action adds a new orderItemCustomization';
  }

  findAll() {
    return `This action returns all orderItemCustomizations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} orderItemCustomization`;
  }

  update(id: string, updateOrderItemCustomizationDto: UpdateOrderItemCustomizationDto) {
    return `This action updates a #${id} orderItemCustomization`;
  }

  remove(id: string) {
    return `This action removes a #${id} orderItemCustomization`;
  }
}
