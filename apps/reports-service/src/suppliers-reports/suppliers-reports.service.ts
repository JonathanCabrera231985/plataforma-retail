// apps/reports-service/src/suppliers-reports/suppliers-reports.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Not, Repository } from 'typeorm';
import { PaymentStatus } from './enums/payment-status.enum';

@Injectable()
export class SuppliersReportsService {
  constructor(
    // 1. Inyectar el repositorio 'PurchaseOrder' usando la conexión 'suppliers_connection'
    @InjectRepository(PurchaseOrder, 'suppliers_connection')
    private readonly poRepository: Repository<PurchaseOrder>,
  ) {}

  /**
   * Genera un resumen de la deuda total a proveedores.
   * (Suma de totalAmount - amountPaid para todas las órdenes que NO están PAGADAS)
   */
  async getSuppliersDebtSummary() {
    try {
      // 2. Usar el Query Builder para crear una consulta SQL
      const result = await this.poRepository
        .createQueryBuilder('po') // 'po' es el alias de purchase_orders
        .select('SUM(po.totalAmount - po.amountPaid)', 'totalDebt') // Calcula la deuda
        .where('po.paymentStatus != :status', { status: PaymentStatus.PAID }) // Filtra solo por órdenes NO PAGADAS
        .getRawOne(); // Obtiene el resultado crudo

      return {
        totalDebt: parseFloat(result.totalDebt) || 0,
      };
    } catch (error) {
      console.error('Error al generar reporte de deudas a proveedores:', error);
      throw new InternalServerErrorException('Error al consultar el reporte de deudas.');
    }
  }

  // --- Limpiamos los métodos CRUD que no se usan ---

  findAll() {
    // Redirigimos el 'findAll' genérico a nuestro método de resumen
    return this.getSuppliersDebtSummary();
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }

  // create(dto: any) {
  //   return 'Este servicio no crea reportes.';
  // }

  // update(id: string, dto: any) {
  //   return 'Este servicio no actualiza reportes.';
  // }

  // remove(id: string) {
  //   return 'Este servicio no elimina reportes.';
  // }
}