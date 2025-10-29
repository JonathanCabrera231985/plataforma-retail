// apps/inventory-service/src/locations/locations.service.ts

import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    // 1. Inyectar el repositorio de Location
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    // 2. Crear la instancia de la entidad
    const location = this.locationRepository.create(createLocationDto);

    try {
      // 3. Guardar en la base de datos
      return await this.locationRepository.save(location);
    } catch (error) {
      // 4. Manejar error de nombre duplicado (código '23505')
      if (error.code === '23505') {
        throw new ConflictException('El nombre de la ubicación ya existe');
      }
      console.error(error); // Loguea otros errores
      throw new InternalServerErrorException('Error al crear la ubicación');
    }
  }

  findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Ubicación con ID "${id}" no encontrada`);
    }
    return location;
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    // TODO: Implementar lógica de actualización
    return `This action updates a #${id} location`;
  }

  remove(id: string) {
    // TODO: Implementar lógica de borrado
    return `This action removes a #${id} location`;
  }
}