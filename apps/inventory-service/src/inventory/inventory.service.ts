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

  /**
   * Incrementa el stock de un producto en una ubicación.
   * @param productId ID del producto
   * @param locationId ID de la ubicación
   * @param amount Cantidad a añadir (debe ser positiva)
   * @returns El registro de stock actualizado
   */
async incrementStock(productId: string, locationId: string, amount: number): Promise<InventoryStock> {
    if (amount <= 0) {
      throw new Error('La cantidad a incrementar debe ser positiva.');
    }

    // Busca el registro existente o crea uno nuevo si no existe con cantidad 0
    let stockItem = await this.inventoryRepository.findOne({
      where: {
        product: { id: productId },
        location: { id: locationId },
      },
    });

    if (!stockItem) {
      // Valida que producto y ubicación existan antes de crear
      const product = await this.productsService.findOne(productId);
      const location = await this.locationsService.findOne(locationId);
      stockItem = this.inventoryRepository.create({
        product: product,
        location: location,
        quantity: 0,
      });
    }

    stockItem.quantity += amount; // Incrementa la cantidad
    return this.inventoryRepository.save(stockItem);
  }

  /**
   * Decrementa el stock de un producto en una ubicación.
   * @param productId ID del producto
   * @param locationId ID de la ubicación
   * @param amount Cantidad a restar (debe ser positiva)
   * @returns El registro de stock actualizado
   * @throws Error si no hay suficiente stock
   */
  async decrementStock(productId: string, locationId: string, amount: number): Promise<InventoryStock> {
    if (amount <= 0) {
      throw new Error('La cantidad a decrementar debe ser positiva.');
    }

    const stockItem = await this.inventoryRepository.findOne({
      where: {
        product: { id: productId },
        location: { id: locationId },
      },
    });

    if (!stockItem) {
      // Opcional: Podrías lanzar error o tratarlo como stock 0
      throw new NotFoundException(`No se encontró stock para el producto ${productId} en la ubicación ${locationId}.`);
    }

    if (stockItem.quantity < amount) {
      throw new Error(`Stock insuficiente. Disponible: ${stockItem.quantity}, Requerido: ${amount}`);
      // Considera usar BadRequestException de @nestjs/common aquí
    }

    stockItem.quantity -= amount; // Decrementa la cantidad
    return this.inventoryRepository.save(stockItem);
  }

}