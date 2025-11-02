import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalPaymentDto } from './create-rental-payment.dto';

export class UpdateRentalPaymentDto extends PartialType(CreateRentalPaymentDto) {}
