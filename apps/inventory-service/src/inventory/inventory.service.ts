// apps/inventory-service/src/inventory/inventory.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryStock } from './entities/inventory-stock.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service'; // Importar ProductsService
import { LocationsService } from '../locations/locations.service'; // Importar LocationsService

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryStock)
    private readonly inventoryRepository: Repository<InventoryStock>,

    // Inyectar los otros servicios
    private readonly productsService: ProductsService,
    private readonly locationsService: LocationsService,
  ) {}

  // Método para establecer o actualizar el stock (Upsert)
  async setStock(createInventoryDto: CreateInventoryDto): Promise<InventoryStock> {
    const { productId, locationId, quantity } = createInventoryDto;

    // 1. Validar que el producto y la ubicación existan
    const product = await this.productsService.findOne(productId); // findOne ya lanza NotFoundException si no existe
    const location = await this.locationsService.findOne(locationId); // findOne ya lanza NotFoundException si no existe

    // 2. Buscar si ya existe un registro de stock para esta combinación
    let stockItem = await this.inventoryRepository.findOne({
      where: {
        product: { id: productId },
        location: { id: locationId },
      },
      // Asegúrate de cargar las relaciones si no son eager
      // relations: ['product', 'location'],
    });

    try {
      if (stockItem) {
        // 3a. Si existe, actualiza la cantidad
        stockItem.quantity = quantity;
      } else {
        // 3b. Si no existe, crea una nueva instancia
        stockItem = this.inventoryRepository.create({
          product: product, // Asigna la entidad completa
          location: location, // Asigna la entidad completa
          quantity: quantity,
        });
      }
      // 4. Guarda el item nuevo o actualizado
      return await this.inventoryRepository.save(stockItem);
    } catch (error) {
      console.error('Error al guardar el stock:', error);
      throw new InternalServerErrorException('Error al establecer el stock del inventario.');
    }
  }

  // Reemplazamos el 'create' genérico con nuestro 'setStock'
  // El controlador llamará a este método desde el endpoint POST /inventory
  async create(createInventoryDto: CreateInventoryDto): Promise<InventoryStock> {
    return this.setStock(createInventoryDto);
  }

  findAll(): Promise<InventoryStock[]> {
    // Devuelve todo el stock, cargando producto y ubicación por 'eager: true'
    return this.inventoryRepository.find();
  }

  async findOne(id: string): Promise<InventoryStock> {
    const stockItem = await this.inventoryRepository.findOne({ where: { id } });
    if (!stockItem) {
      throw new NotFoundException(`Registro de inventario con ID "${id}" no encontrado`);
    }
    return stockItem;
  }

  // Podríamos implementar un 'update' que solo ajuste la cantidad
  async adjustStock(id: string, updateInventoryDto: UpdateInventoryDto): Promise<InventoryStock> {
     const { quantity } = updateInventoryDto;
     if (quantity === undefined) {
       throw new InternalServerErrorException('La cantidad es requerida para ajustar el stock.');
     }
     const stockItem = await this.findOne(id); // findOne ya valida si existe
     stockItem.quantity = quantity;
     return this.inventoryRepository.save(stockItem);
  }

   // Mantenemos el método 'update' para que el controlador funcione, pero lo redirigimos
   async update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<InventoryStock> {
     // Por ahora, solo permitimos actualizar la cantidad
     return this.adjustStock(id, updateInventoryDto);
   }


  async remove(id: string): Promise<void> {
    const result = await this.inventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de inventario con ID "${id}" no encontrado`);
    }
  }
}