// apps/store-operations-service/src/rental-payments/rental-payments.module.ts

import { Module } from '@nestjs/common';
import { RentalPaymentsService } from './rental-payments.service';
import { RentalPaymentsController } from './rental-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { RentalPayment } from './entities/rental-payment.entity'; // Importar
import { StoresModule } from '../stores/stores.module'; // Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalPayment]), // Registrar Entidad
    StoresModule, // Importar StoresModule
  ],
  controllers: [RentalPaymentsController],
  providers: [RentalPaymentsService],
  exports: [RentalPaymentsService], // Para reportes
})
export class RentalPaymentsModule {}