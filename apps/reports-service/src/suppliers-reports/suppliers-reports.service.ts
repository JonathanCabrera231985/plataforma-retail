import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from './enums/payment-status.enum';

@Injectable()
export class SuppliersReportsService {
  private suppliersServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.suppliersServiceUrl =
      this.configService.get<string>('SUPPLIERS_SERVICE_URL') ||
      'http://suppliers-service:3003/purchase-orders';
  }

  /**
   * Genera un resumen de la deuda total a proveedores.
   * (Suma de totalAmount - amountPaid para todas las órdenes que NO están PAGADAS)
   */
  async getSuppliersDebtSummary(authHeader?: string) {
    try {
      const headers: HeadersInit = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      const response = await fetch(this.suppliersServiceUrl, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch purchase orders from suppliers-service: ${response.statusText}`,
        );
      }

      const purchaseOrders = await response.json();

      let totalDebt = 0;

      for (const po of purchaseOrders) {
        if (po.paymentStatus !== PaymentStatus.PAID) {
          const totalAmount = parseFloat(po.totalAmount) || 0;
          const amountPaid = parseFloat(po.amountPaid) || 0;
          totalDebt += totalAmount - amountPaid;
        }
      }

      return {
        totalDebt,
      };
    } catch (error) {
      console.error('Error al generar reporte de deudas a proveedores:', error);
      throw new InternalServerErrorException(
        'Error al consultar el reporte de deudas.',
      );
    }
  }

  findAll(authHeader?: string) {
    // Redirigimos el 'findAll' genérico a nuestro método de resumen
    return this.getSuppliersDebtSummary(authHeader);
  }

  findOne(id: string) {
    return `Reporte para ${id} no implementado.`;
  }
}