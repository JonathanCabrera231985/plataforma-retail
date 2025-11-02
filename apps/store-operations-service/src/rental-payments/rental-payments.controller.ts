import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalPaymentsService } from './rental-payments.service';
import { CreateRentalPaymentDto } from './dto/create-rental-payment.dto';
import { UpdateRentalPaymentDto } from './dto/update-rental-payment.dto';

@Controller('rental-payments')
export class RentalPaymentsController {
  constructor(private readonly rentalPaymentsService: RentalPaymentsService) {}

  @Post()
  create(@Body() createRentalPaymentDto: CreateRentalPaymentDto) {
    return this.rentalPaymentsService.create(createRentalPaymentDto);
  }

  @Get()
  findAll() {
    return this.rentalPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalPaymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalPaymentDto: UpdateRentalPaymentDto) {
    return this.rentalPaymentsService.update(id, updateRentalPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalPaymentsService.remove(id);
  }
}
