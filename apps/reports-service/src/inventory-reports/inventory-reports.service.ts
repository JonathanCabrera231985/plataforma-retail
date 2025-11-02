// apps/reports-service/src/inventory-reports/inventory-reports.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryStock } from './entities/inventory-stock.entity';
import { Repository } from 'typeorm';
// No necesitamos DTOs para consultas GET

@Injectable()
export class InventoryReportsService {
  constructor(
    // 1. Inyectar el repositorio 'InventoryStock' usando la conexión 'inventory_connection'
    @InjectRepository(InventoryStock, 'inventory_connection')
    private readonly stockRepository: Repository<InventoryStock>,
  ) {}

  /**
   * Reporte: Stock detallado (todos los productos en todas las ubicaciones)
   */
  async getDetailedStockReport(): Promise<InventoryStock[]> {
    // Usamos 'relations' para cargar explícitamente los datos del producto y la ubicación
    return this.stockRepository.find({
      relations: ['product', 'location'],
      order: {
        location: { name: 'ASC' }, // Ordena por nombre de ubicación
        product: { name: 'ASC' }, // Luego por nombre de producto
      },
    });
  }

  /**
   * Reporte: Stock de una ubicación específica
   */
  async getStockByLocation(locationId: string): Promise<InventoryStock[]> {
    const stock = await this.stockRepository.find({
      where: { location: { id: locationId } }, // Filtra por el ID de la ubicación
      relations: ['product', 'location'],
      order: {
        product: { name: 'ASC' }, // Ordena por nombre de producto
      },
    });

    if (!stock || stock.length === 0) {
      // Opcional: podrías verificar si la ubicación existe
      throw new NotFoundException(`No se encontró stock para la ubicación con ID "${locationId}"`);
    }
    return stock;
  }

  // --- Limpiamos los métodos CRUD que no se usan ---
  // Este servicio es de SOLO LECTURA

  create(dto: any) {
    return 'Este servicio no crea reportes.';
  }

  findAll() {
    // Redirigimos el 'findAll' genérico a nuestro reporte detallado
    return this.getDetailedStockReport();
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }

  update(id: string, dto: any) {
    return 'Este servicio no actualiza reportes.';
  }

  remove(id: string) {
    return 'Este servicio no elimina reportes.';
  }
}
