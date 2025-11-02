import { Module } from '@nestjs/common';
import { RentalPaymentsService } from './rental-payments.service';
import { RentalPaymentsController } from './rental-payments.controller';

@Module({
  controllers: [RentalPaymentsController],
  providers: [RentalPaymentsService],
})
export class RentalPaymentsModule {}
