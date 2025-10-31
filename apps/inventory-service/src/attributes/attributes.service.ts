// apps/inventory-service/src/attributes/attributes.service.ts

import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttributesService {
  constructor(
    // 1. Inyectar el repositorio de Attribute
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    // 2. Crear la instancia de la entidad
    const attribute = this.attributeRepository.create(createAttributeDto);

    try {
      // 3. Guardar en la base de datos
      return await this.attributeRepository.save(attribute);
    } catch (error) {
      // 4. Manejar error de nombre duplicado (código '23505')
      if (error.code === '23505') {
        throw new ConflictException('El nombre del atributo ya existe');
      }
      console.error(error); // Loguea otros errores
      throw new InternalServerErrorException('Error al crear el atributo');
    }
  }

  findAll(): Promise<Attribute[]> {
    // Carga los atributos y sus valores gracias a 'eager: true'
    return this.attributeRepository.find();
  }

  async findOne(id: string): Promise<Attribute> {
    // Carga el atributo y sus valores gracias a 'eager: true'
    const attribute = await this.attributeRepository.findOne({ where: { id } });
    if (!attribute) {
      throw new NotFoundException(`Atributo con ID "${id}" no encontrado`);
    }
    return attribute;
  }

  update(id: string, updateAttributeDto: UpdateAttributeDto) {
    // TODO: Implementar lógica de actualización
    return `This action updates a #${id} attribute`;
  }

  remove(id: string) {
    // TODO: Implementar lógica de borrado
    return `This action removes a #${id} attribute`;
  }
}