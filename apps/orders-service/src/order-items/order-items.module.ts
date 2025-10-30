import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { OrderItem } from './entities/order-item.entity'; // Importar

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])], // Registrar la entidad
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
})
export class OrderItemsModule {}