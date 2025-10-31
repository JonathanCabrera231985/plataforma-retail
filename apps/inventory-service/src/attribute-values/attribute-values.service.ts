// apps/inventory-service/src/attribute-values/attribute-values.service.ts

import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeValue } from './entities/attribute-value.entity';
import { Repository } from 'typeorm';
import { AttributesService } from '../attributes/attributes.service'; // 1. Importar AttributesService

@Injectable()
export class AttributeValuesService {
  constructor(
    // 2. Inyectar el repositorio de AttributeValue
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,

    // 3. Inyectar el AttributesService
    private readonly attributesService: AttributesService,
  ) {}

  async create(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
    const { value, attributeId } = createAttributeValueDto;

    // 4. Buscar el atributo padre
    const attribute = await this.attributesService.findOne(attributeId);
    // findOne ya lanza NotFoundException si no existe

    // 5. Crear la instancia del valor y asociar el atributo
    const attributeValue = this.attributeValueRepository.create({
      value: value,
      attribute: attribute, // Asigna la entidad completa
    });

    try {
      // 6. Guardar en la base de datos
      return await this.attributeValueRepository.save(attributeValue);
    } catch (error) {
      // TODO: Manejar error de valor duplicado para el mismo atributo
      console.error(error);
      throw new InternalServerErrorException('Error al crear el valor del atributo');
    }
  }

  findAll(): Promise<AttributeValue[]> {
    // Carga los valores con su atributo padre gracias a 'eager: true'
    return this.attributeValueRepository.find();
  }

  async findOne(id: string): Promise<AttributeValue> {
    const attributeValue = await this.attributeValueRepository.findOne({ where: { id } });
    if (!attributeValue) {
      throw new NotFoundException(`Valor de atributo con ID "${id}" no encontrado`);
    }
    return attributeValue;
  }

  update(id: string, updateAttributeValueDto: UpdateAttributeValueDto) {
    // TODO: Implementar lógica de actualización
    return `This action updates a #${id} attributeValue`;
  }

  remove(id: string) {
    // TODO: Implementar lógica de borrado
    return `This action removes a #${id} attributeValue`;
  }
}