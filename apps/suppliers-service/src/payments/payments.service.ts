// apps/suppliers-service/src/payments/payments.service.ts

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { PaymentStatus, PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    // Inyecta el servicio de Órdenes de Compra
    private readonly purchaseOrdersService: PurchaseOrdersService,

    // Inyecta el DataSource para manejar transacciones
    private readonly dataSource: DataSource,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { purchaseOrderId, amount } = createPaymentDto;

    // 1. Inicia una transacción de base de datos
    // (Para asegurar que o se crea el pago Y se actualiza la orden, o no se hace nada)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Buscar la orden de compra (usando el servicio)
      const purchaseOrder = await this.purchaseOrdersService.findOne(purchaseOrderId);
      if (!purchaseOrder) {
        // findOne ya lanza NotFound, pero doble chequeo
        throw new NotFoundException(`Orden de compra con ID ${purchaseOrderId} no encontrada.`);
      }

      // 3. Validar que el abono no exceda la deuda
      const remainingDue = purchaseOrder.totalAmount - purchaseOrder.amountPaid;
      if (amount > remainingDue) {
        throw new BadRequestException(`El monto del abono (${amount}) excede la deuda restante (${remainingDue}).`);
      }

      // 4. Crear y guardar el nuevo pago
      const payment = this.paymentRepository.create({
        ...createPaymentDto,
        purchaseOrder: purchaseOrder, // Asigna la entidad completa
      });
      const savedPayment = await queryRunner.manager.save(payment);

      // 5. Actualizar la orden de compra (amountPaid y paymentStatus)
      const newAmountPaid = purchaseOrder.amountPaid + amount;

      let newPaymentStatus = PaymentStatus.PARTIAL;
      if (newAmountPaid === purchaseOrder.totalAmount) {
        newPaymentStatus = PaymentStatus.PAID;
      }

      // Actualiza la orden de compra usando el queryRunner
      await queryRunner.manager.update(PurchaseOrder, purchaseOrderId, {
        amountPaid: newAmountPaid,
        paymentStatus: newPaymentStatus,
      });

      // 6. Confirma la transacción
      await queryRunner.commitTransaction();
      return savedPayment;

    } catch (error) {
      // 7. Si algo falla, revierte la transacción
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Error al registrar el pago.');
    } finally {
      // 8. Libera el queryRunner
      await queryRunner.release();
    }
  }

  findAll() {
    // TODO: Implementar lógica de listado (útil para reportes)
    return this.paymentRepository.find({ relations: ['purchaseOrder'] });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id }, relations: ['purchaseOrder'] });
    if (!payment) {
      throw new NotFoundException(`Pago con ID "${id}" no encontrado`);
    }
    return payment;
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    // Generalmente los pagos no se actualizan, se anulan con un pago inverso
    return `This action updates a #${id} payment`;
  }

  remove(id: string) {
    // Generalmente los pagos no se eliminan
    return `This action removes a #${id} payment`;
  }
}