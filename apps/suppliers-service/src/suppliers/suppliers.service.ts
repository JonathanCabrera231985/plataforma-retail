// apps/suppliers-service/src/suppliers/suppliers.service.ts

import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    // 1. Inyectar el repositorio de Supplier
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    // 2. Crear la instancia de la entidad
    const supplier = this.supplierRepository.create(createSupplierDto);

    try {
      // 3. Guardar en la base de datos
      return await this.supplierRepository.save(supplier);
    } catch (error) {
      // 4. Manejar error de nombre o RUC duplicado (código '23505')
      if (error.code === '23505') {
        if (error.detail.includes('name')) {
          throw new ConflictException('El nombre del proveedor ya existe');
        }
        if (error.detail.includes('ruc')) {
          throw new ConflictException('El RUC del proveedor ya existe');
        }
      }
      console.error(error); // Loguea otros errores
      throw new InternalServerErrorException('Error al crear el proveedor');
    }
  }

  findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID "${id}" no encontrado`);
    }
    return supplier;
  }

  update(id: string, updateSupplierDto: UpdateSupplierDto) {
    // TODO: Implementar lógica de actualización
    return `This action updates a #${id} supplier`;
  }

  remove(id: string) {
    // TODO: Implementar lógica de borrado
    return `This action removes a #${id} supplier`;
  }
}