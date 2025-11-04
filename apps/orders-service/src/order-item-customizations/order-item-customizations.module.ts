import { Module } from '@nestjs/common';
import { OrderItemCustomizationsService } from './order-item-customizations.service';
import { OrderItemCustomizationsController } from './order-item-customizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { OrderItemCustomization } from './entities/order-item-customization.entity'; // Importar

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemCustomization])], // Registrar
  controllers: [OrderItemCustomizationsController],
  providers: [OrderItemCustomizationsService],
})
export class OrderItemCustomizationsModule {}