// apps/inventory-service/src/categories/categories.service.ts

import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    // 1. Inyectar el repositorio de Category
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // 2. Crear la instancia de la entidad
    const category = this.categoryRepository.create(createCategoryDto);

    try {
      // 3. Guardar en la base de datos
      return await this.categoryRepository.save(category);
    } catch (error) {
      // 4. Manejar error de nombre duplicado (código '23505')
      if (error.code === '23505') {
        throw new ConflictException('El nombre de la categoría ya existe');
      }
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }

  findAll() {
    // Implementaremos esto después
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    // Implementaremos esto después
    return this.categoryRepository.findOne({ where: { id } });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Implementaremos esto después
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    // Implementaremos esto después
    return `This action removes a #${id} category`;
  }
}