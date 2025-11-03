// apps/reports-service/src/store-ops-reports/store-ops-reports.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalPayment } from './entities/rental-payment.entity';
import { Repository } from 'typeorm';
import { RentalPaymentStatus } from './enums/rental-payment-status.enum';

@Injectable()
export class StoreOpsReportsService {
  constructor(
    // 1. Inyectar el repositorio 'RentalPayment' usando la conexión 'store_ops_connection'
    @InjectRepository(RentalPayment, 'store_ops_connection')
    private readonly paymentRepository: Repository<RentalPayment>,
  ) {}

  /**
   * Reporte: Total de alquileres pendientes de aprobación por "Maria Fernanda".
   */
  async getPendingRentalPaymentsReport() {
    try {
      // 2. Usar el Query Builder
      const result = await this.paymentRepository
        .createQueryBuilder('payment') // 'payment' es el alias de la tabla
        .select('SUM(payment.amount)', 'totalPendingAmount') // Calcula la SUMA de 'amount'
        .addSelect('COUNT(payment.id)', 'totalPendingPayments') // Cuenta el número de pagos
        .where('payment.status = :status', {
          status: RentalPaymentStatus.PENDING_APPROVAL, // Filtra por PENDIENTE_APROBACION
        })
        .getRawOne(); // Obtiene el resultado crudo

      return {
        totalPendingAmount: parseFloat(result.totalPendingAmount) || 0,
        totalPendingPayments: parseInt(result.totalPendingPayments, 10) || 0,
      };
    } catch (error) {
      console.error('Error al generar reporte de alquileres pendientes:', error);
      throw new InternalServerErrorException('Error al consultar el reporte de alquileres.');
    }
  }

  // --- Limpiamos los métodos CRUD que no se usan ---

  findAll() {
    // Hacemos que el findAll por defecto llame a nuestro reporte
    return this.getPendingRentalPaymentsReport();
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