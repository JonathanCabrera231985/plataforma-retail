// apps/store-operations-service/src/stores/stores.service.ts

import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    // 1. Inyectar el repositorio de Store
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    // 2. Crear la instancia de la entidad
    const store = this.storeRepository.create(createStoreDto);

    try {
      // 3. Guardar en la base de datos
      return await this.storeRepository.save(store);
    } catch (error) {
      // 4. Manejar error de nombre o dueño duplicado (código '23505')
      if (error.code === '23505') {
        if (error.detail.includes('name')) {
          throw new ConflictException('El nombre de la tienda ya existe');
        }
        if (error.detail.includes('owner_user_id')) {
          throw new ConflictException('Este usuario ya es dueño de otra tienda');
        }
      }
      console.error(error); // Loguea otros errores
      throw new InternalServerErrorException('Error al crear la tienda');
    }
  }

  findAll(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Tienda con ID "${id}" no encontrada`);
    }
    return store;
  }

  // Ya corregimos el ID a string en el paso anterior
  update(id: string, updateStoreDto: UpdateStoreDto) {
    // TODO: Implementar lógica de actualización
    return `This action updates a #${id} store`;
  }

  remove(id: string) {
    // TODO: Implementar lógica de borrado
    return `This action removes a #${id} store`;
  }
}