import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { Order } from './entities/order.entity'; // Importar

@Module({
  imports: [TypeOrmModule.forFeature([Order])], // Registrar la entidad
  controllers: [OrdersController],
  providers: [OrdersService],
}