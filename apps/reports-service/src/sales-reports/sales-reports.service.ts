import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class SalesReportsService {
  private ordersServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.ordersServiceUrl =
      this.configService.get<string>('ORDERS_SERVICE_URL') ||
      'http://orders-service:3002/orders';
  }

  /**
   * Genera un resumen de ventas totales.
   */
  async getSalesSummary(authHeader?: string) {
    try {
      const headers: HeadersInit = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      const response = await fetch(this.ordersServiceUrl, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch orders from orders-service: ${response.statusText}`,
        );
      }

      const orders = await response.json();

      // Convertir y calcular sumas
      let totalSales = 0;
      let totalOrders = 0;

      for (const order of orders) {
        if (order.status === OrderStatus.PAID) {
          totalSales += parseFloat(order.total) || 0;
          totalOrders++;
        }
      }

      return {
        totalSales,
        totalOrders,
      };
    } catch (error) {
      console.error('Error al generar reporte de ventas:', error);
      throw new InternalServerErrorException(
        'Error al consultar el reporte de ventas.',
      );
    }
  }

  findAll(authHeader?: string) {
    // Redirigimos el 'findAll' genérico a nuestro método de resumen
    return this.getSalesSummary(authHeader);
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }
}