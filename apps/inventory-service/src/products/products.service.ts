// apps/inventory-service/src/products/products.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'; // Asegúrate que NotFoundException esté importado
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';

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

  // --- IMPLEMENTACIÓN DE FINDALL ---
  async findAll(): Promise<Product[]> {
    // Gracias a 'eager: true' en la entidad Product,
    // esto cargará automáticamente la información de la categoría.
    return this.productRepository.find();
    // Si no usaras 'eager', podrías especificarlo aquí:
    // return this.productRepository.find({ relations: ['category'] });
  }

  // --- IMPLEMENTACIÓN DE FINDONE ---
  async findOne(id: string): Promise<Product> {
    // También carga la categoría por 'eager: true'
    const product = await this.productRepository.findOne({ where: { id } });

    // Verifica si el producto existe
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // 1. Carga el producto existente junto con su categoría actual
    //    Usamos 'preload' que busca el producto por ID y luego fusiona los nuevos datos.
    //    Si el producto no existe, retorna undefined.
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto, // Fusiona los datos del DTO
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }

    // 2. (Opcional) Si se proporciona un categoryId en el DTO, busca y asigna la nueva categoría
    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(updateProductDto.categoryId);
      if (!category) {
        throw new NotFoundException(`Categoría con ID "${updateProductDto.categoryId}" no encontrada al actualizar`);
      }
      product.category = category;
    }

    try {
      // 3. Guarda los cambios en la base de datos
      return await this.productRepository.save(product);
    } catch (error) {
      // TODO: Manejar errores específicos (ej. SKU duplicado si existe)
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el producto');
    }
  }

  async remove(id: string): Promise<void> { // Cambiamos el retorno a Promise<void>
    // 1. Primero busca el producto para asegurarte de que existe
    const product = await this.findOne(id); // Reutiliza findOne que ya lanza NotFoundException

    // 2. Elimina el producto
    // Usamos 'remove' que opera sobre la entidad encontrada
    // await this.productRepository.remove(product);
    // O puedes usar 'delete' que opera directamente por ID
    const deleteResult = await this.productRepository.delete(id);

    if (deleteResult.affected === 0) {
        // Esto no debería ocurrir si findOne tuvo éxito, pero es una buena práctica
        throw new NotFoundException(`Producto con ID "${id}" no encontrado al intentar eliminar`);
    }
    // No retornamos nada en un DELETE exitoso (o puedes retornar { affected: deleteResult.affected })
  }
}