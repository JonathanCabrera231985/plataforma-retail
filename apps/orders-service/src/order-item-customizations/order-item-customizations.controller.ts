import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemCustomizationsService } from './order-item-customizations.service';
import { CreateOrderItemCustomizationDto } from './dto/create-order-item-customization.dto';
import { UpdateOrderItemCustomizationDto } from './dto/update-order-item-customization.dto';

@Controller('order-item-customizations')
export class OrderItemCustomizationsController {
  constructor(private readonly orderItemCustomizationsService: OrderItemCustomizationsService) {}

  @Post()
  create(@Body() createOrderItemCustomizationDto: CreateOrderItemCustomizationDto) {
    return this.orderItemCustomizationsService.create(createOrderItemCustomizationDto);
  }

  @Get()
  findAll() {
    return this.orderItemCustomizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemCustomizationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderItemCustomizationDto: UpdateOrderItemCustomizationDto) {
    return this.orderItemCustomizationsService.update(id, updateOrderItemCustomizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemCustomizationsService.remove(id);
  }
}
