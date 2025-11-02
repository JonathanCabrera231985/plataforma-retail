// apps/reports-service/src/sales-reports/sales-reports.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class SalesReportsService {
  constructor(
    // 1. Inyectar el repositorio 'Order' usando la conexión 'orders_connection'
    @InjectRepository(Order, 'orders_connection')
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Genera un resumen de ventas totales.
   */
  async getSalesSummary() {
    try {
      // 2. Usar el Query Builder para crear una consulta SQL
      const result = await this.orderRepository
        .createQueryBuilder('order') // 'order' es el alias de la tabla
        .select('SUM(order.total)', 'totalSales') // Calcula la SUMA de la columna 'total'
        .addSelect('COUNT(order.id)', 'totalOrders') // Cuenta el número de órdenes
        .where('order.status = :status', { status: OrderStatus.PAID }) // Filtra solo por órdenes PAGADAS
        .getRawOne(); // Obtiene el resultado crudo (ej. { totalSales: '1500.75', totalOrders: '10' })

      // Convertir a números
      return {
        totalSales: parseFloat(result.totalSales) || 0,
        totalOrders: parseInt(result.totalOrders, 10) || 0,
      };
    } catch (error) {
      console.error('Error al generar reporte de ventas:', error);
      throw new InternalServerErrorException('Error al consultar el reporte de ventas.');
    }
  }

  // --- Limpiamos los métodos CRUD que no se usan ---
  // Este servicio no debe crear, actualizar o eliminar datos de ventas.

  findAll() {
    // Redirigimos el 'findAll' genérico a nuestro método de resumen
    return this.getSalesSummary();
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }

  // create(createSalesReportDto: any) {
  //   return 'Este servicio no crea reportes, solo los consulta.';
  // }

  // update(id: string, updateSalesReportDto: any) {
  //   return 'Este servicio no actualiza reportes.';
  // }

  // remove(id: string) {
  //   return 'Este servicio no elimina reportes.';
  // }
}