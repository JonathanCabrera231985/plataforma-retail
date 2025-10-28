// apps/inventory-service/src/products/products.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service'; // Importa CategoriesService

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // Inyecta CategoriesService para buscar categorías
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;

    // 1. Busca la categoría por ID
    const category = await this.categoriesService.findOne(categoryId); // Usamos el servicio de categorías
    if (!category) {
      throw new NotFoundException(`Categoría con ID "${categoryId}" no encontrada`);
    }

    // 2. Crea la instancia del producto y asigna la categoría encontrada
    const product = this.productRepository.create({
      ...productData,
      category: category, // Asigna la entidad Category completa
    });

    try {
      // 3. Guarda el producto en la base de datos
      return await this.productRepository.save(product);
    } catch (error) {
      // TODO: Manejar errores específicos (ej. SKU duplicado si lo haces único)
      console.error(error); // Loguea el error para depuración
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  findAll() {
    // Devuelve productos con sus categorías (por el 'eager: true' en la entidad)
    return this.productRepository.find();
    // Podrías añadir { relations: ['category'] } si no usaras 'eager'
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    // Implementar lógica de actualización (incluyendo buscar categoría si cambia)
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    // Implementar lógica de borrado
    return `This action removes a #${id} product`;
  }
}