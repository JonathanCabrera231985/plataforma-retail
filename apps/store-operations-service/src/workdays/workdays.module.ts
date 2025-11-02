import { Module } from '@nestjs/common';
import { WorkdaysService } from './workdays.service';
import { WorkdaysController } from './workdays.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { Workday } from './entities/workday.entity'; // Importar
import { StoresModule } from '../stores/stores.module'; // Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([Workday]), // Registrar Entidad
    StoresModule, // Importar StoresModule
  ],
  controllers: [WorkdaysController],
  providers: [WorkdaysService],
  exports: [WorkdaysService], // Exportar
})
export class WorkdaysModule {}
