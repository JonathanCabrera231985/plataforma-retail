import { Injectable } from '@nestjs/common';
import { CreateRentalPaymentDto } from './dto/create-rental-payment.dto';
import { UpdateRentalPaymentDto } from './dto/update-rental-payment.dto';

@Injectable()
export class RentalPaymentsService {
  create(createRentalPaymentDto: CreateRentalPaymentDto) {
    return 'This action adds a new rentalPayment';
  }

  findAll() {
    return `This action returns all rentalPayments`;
  }

  findOne(id: string) {
    return `This action returns a #${id} rentalPayment`;
  }

  update(id: string, updateRentalPaymentDto: UpdateRentalPaymentDto) {
    return `This action updates a #${id} rentalPayment`;
  }

  remove(id: string) {
    return `This action removes a #${id} rentalPayment`;
  }
}
