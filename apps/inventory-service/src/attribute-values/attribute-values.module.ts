import { Module } from '@nestjs/common';
import { AttributeValuesService } from './attribute-values.service';
import { AttributeValuesController } from './attribute-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar
import { AttributeValue } from './entities/attribute-value.entity'; // Importar
import { AttributesModule } from '../attributes/attributes.module'; // Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeValue]), // Registrar Entidad
    AttributesModule, // Importar módulo
  ],
  controllers: [AttributeValuesController],
  providers: [AttributeValuesService],
})
export class AttributeValuesModule {}
