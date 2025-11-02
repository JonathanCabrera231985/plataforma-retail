import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalPaymentsService } from './rental-payments.service';
import { CreateRentalPaymentDto } from './dto/create-rental-payment.dto';
import { UpdateRentalPaymentDto } from './dto/update-rental-payment.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { MarkAsPaidDto } from './dto/mark-as-paid.dto';

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
// --- ENDPOINT PARA APROBAR ---
  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  approve(
    @Param('id') id: string,
    @Body() approvePaymentDto: ApprovePaymentDto,
  ) {
    return this.rentalPaymentsService.approve(id, approvePaymentDto);
  }

  // --- ENDPOINT PARA MARCAR COMO PAGADO ---
  @Patch(':id/pay')
  @HttpCode(HttpStatus.OK)
  markAsPaid(
    @Param('id') id: string,
    @Body() markAsPaidDto: MarkAsPaidDto,
  ) {
    return this.rentalPaymentsService.markAsPaid(id, markAsPaidDto);
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
