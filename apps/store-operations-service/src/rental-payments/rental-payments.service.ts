// apps/store-operations-service/src/rental-payments/rental-payments.service.ts

import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRentalPaymentDto } from './dto/create-rental-payment.dto';
import { UpdateRentalPaymentDto } from './dto/update-rental-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalPayment } from './entities/rental-payment.entity';
import { Repository } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { RentalPaymentStatus } from './enums/rental-payment-status.enum';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { MarkAsPaidDto } from './dto/mark-as-paid.dto';

@Injectable()
export class RentalPaymentsService {
  constructor(
    @InjectRepository(RentalPayment)
    private readonly rentalPaymentRepository: Repository<RentalPayment>,

    // Inyectamos StoresService para buscar la tienda
    private readonly storesService: StoresService,
  ) {}

  /**
   * Registra un nuevo pago de alquiler (lo crea en estado PENDIENTE)
   */
  async create(createRentalPaymentDto: CreateRentalPaymentDto): Promise<RentalPayment> {
    const { storeId, amount, month, year } = createRentalPaymentDto;

    // 1. Validar que la tienda exista
    const store = await this.storesService.findOne(storeId);
    // findOne ya lanza NotFoundException si no existe

    return await this.rentalPaymentRepository.manager.transaction(async transactionalEntityManager => {
      // 2. Validar que no exista ya un pago para esa tienda en ese mes/año con bloqueo pesimista
      const existingPayment = await transactionalEntityManager.findOne(RentalPayment, {
        where: { store: { id: storeId }, month, year },
        lock: { mode: 'pessimistic_write' },
      });

      if (existingPayment) {
        throw new ConflictException(`Ya existe un registro de pago para la tienda ${store.name} en ${month}/${year}`);
      }

      // 3. Crear el nuevo registro de pago
      const rentalPayment = this.rentalPaymentRepository.create({
        store: store,
        amount,
        month,
        year,
        status: RentalPaymentStatus.PENDING_APPROVAL, // Estado inicial
      });

      try {
        // 4. Guardar en la base de datos dentro de la transacción
        return await transactionalEntityManager.save(RentalPayment, rentalPayment);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al registrar el pago de alquiler');
      }
    });
  }

  findAll(): Promise<RentalPayment[]> {
    // Carga los pagos con sus tiendas gracias a 'eager: true'
    return this.rentalPaymentRepository.find();
  }

  async findOne(id: string): Promise<RentalPayment> {
    const payment = await this.rentalPaymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago de alquiler con ID "${id}" no encontrado`);
    }
    return payment;
  }

  /**
   * Aprueba un pago de alquiler (Acción de Maria Fernanda)
   */
  async approve(id: string, approvePaymentDto: ApprovePaymentDto): Promise<RentalPayment> {
    const { approvedByMfUserId } = approvePaymentDto;

    return await this.rentalPaymentRepository.manager.transaction(async transactionalEntityManager => {
      // 1. Buscar el pago con bloqueo pesimista
      const payment = await transactionalEntityManager.findOne(RentalPayment, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment) {
        throw new NotFoundException(`Pago de alquiler con ID "${id}" no encontrado`);
      }

      // 2. Validar el estado
      if (payment.status !== RentalPaymentStatus.PENDING_APPROVAL) {
        throw new BadRequestException(`Este pago no está pendiente de aprobación (Estado actual: ${payment.status})`);
      }

      // 3. Actualizar estado y guardar
      payment.status = RentalPaymentStatus.APPROVED;
      payment.approvedByMfUserId = approvedByMfUserId;

      try {
        return await transactionalEntityManager.save(RentalPayment, payment);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al aprobar el pago.');
      }
    });
  }

  /**
   * Marca un pago aprobado como PAGADO
   */
  async markAsPaid(id: string, markAsPaidDto: MarkAsPaidDto): Promise<RentalPayment> {
    const { notes } = markAsPaidDto;

    return await this.rentalPaymentRepository.manager.transaction(async transactionalEntityManager => {
      // 1. Buscar el pago con bloqueo pesimista
      const payment = await transactionalEntityManager.findOne(RentalPayment, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment) {
        throw new NotFoundException(`Pago de alquiler con ID "${id}" no encontrado`);
      }

      // 2. Validar el estado
      if (payment.status !== RentalPaymentStatus.APPROVED) {
        throw new BadRequestException(`Este pago no puede marcarse como pagado (Estado actual: ${payment.status})`);
      }

      // 3. Actualizar estado y guardar
      payment.status = RentalPaymentStatus.PAID;
      payment.paymentDate = new Date(); // Registra la fecha de pago
      if (notes) {
        payment.notes = notes;
      }

      try {
        return await transactionalEntityManager.save(RentalPayment, payment);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al marcar el pago como pagado.');
      }
    });
  }
  // Dejamos este 'update' genérico vacío por ahora, ya que usamos métodos específicos
  update(id: string, updateRentalPaymentDto: UpdateRentalPaymentDto) {
    return `Use los endpoints /approve o /pay para actualizar el estado de un pago.`;
  }

  remove(id: string) {
    return `This action removes a #${id} rentalPayment`;
  }
}