import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InventoryReportsService {
  private inventoryServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.inventoryServiceUrl =
      this.configService.get<string>('INVENTORY_SERVICE_URL') ||
      'http://inventory-service:3001/inventory';
  }

  /**
   * Reporte: Stock detallado (todos los productos en todas las ubicaciones)
   */
  async getDetailedStockReport(): Promise<any[]> {
    try {
      const response = await fetch(this.inventoryServiceUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch stock from inventory-service: ${response.statusText}`,
        );
      }
      const stock = await response.json();

      // Sort by location name ASC, then product name ASC
      return stock.sort((a, b) => {
        const locA = a.location?.name || '';
        const locB = b.location?.name || '';
        if (locA !== locB) {
          return locA.localeCompare(locB);
        }
        const prodA = a.product?.name || '';
        const prodB = b.product?.name || '';
        return prodA.localeCompare(prodB);
      });
    } catch (error) {
      console.error('Error al generar reporte de inventario:', error);
      throw new NotFoundException('Error al consultar el reporte de inventario.');
    }
  }

  /**
   * Reporte: Stock de una ubicación específica
   */
  async getStockByLocation(locationId: string): Promise<any[]> {
    try {
      const response = await fetch(this.inventoryServiceUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch stock from inventory-service: ${response.statusText}`,
        );
      }
      const stock = await response.json();

      // Filter by location id
      const filteredStock = stock.filter(
        item => item.location?.id === locationId,
      );

      if (filteredStock.length === 0) {
        throw new NotFoundException(
          `No se encontró stock para la ubicación con ID "${locationId}"`,
        );
      }

      // Sort by product name ASC
      return filteredStock.sort((a, b) => {
        const prodA = a.product?.name || '';
        const prodB = b.product?.name || '';
        return prodA.localeCompare(prodB);
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(
        'Error al generar reporte de inventario por ubicación:',
        error,
      );
      throw new NotFoundException(
        `Error al consultar el reporte de inventario para la ubicación.`,
      );
    }
  }

  findAll() {
    // Redirigimos el 'findAll' genérico a nuestro reporte detallado
    return this.getDetailedStockReport();
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }
}
