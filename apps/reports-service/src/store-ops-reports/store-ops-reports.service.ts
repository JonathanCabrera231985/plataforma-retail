import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RentalPaymentStatus } from './enums/rental-payment-status.enum';

@Injectable()
export class StoreOpsReportsService {
  private storeOpsServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.storeOpsServiceUrl =
      this.configService.get<string>('STORE_OPS_SERVICE_URL') ||
      'http://store-operations-service:3004/rental-payments';
  }

  /**
   * Reporte: Total de alquileres pendientes de aprobación por "Maria Fernanda".
   */
  async getPendingRentalPaymentsReport(authHeader?: string) {
    try {
      const headers: HeadersInit = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      const response = await fetch(this.storeOpsServiceUrl, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch rental payments from store-operations-service: ${response.statusText}`,
        );
      }

      const payments = await response.json();

      let totalPendingAmount = 0;
      let totalPendingPayments = 0;

      for (const payment of payments) {
        if (payment.status === RentalPaymentStatus.PENDING_APPROVAL) {
          totalPendingAmount += parseFloat(payment.amount) || 0;
          totalPendingPayments++;
        }
      }

      return {
        totalPendingAmount,
        totalPendingPayments,
      };
    } catch (error) {
      console.error(
        'Error al generar reporte de alquileres pendientes:',
        error,
      );
      throw new InternalServerErrorException(
        'Error al consultar el reporte de alquileres.',
      );
    }
  }

  findAll(authHeader?: string) {
    // Hacemos que el findAll por defecto llame a nuestro reporte
    return this.getPendingRentalPaymentsReport(authHeader);
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }
}