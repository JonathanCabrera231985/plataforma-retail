// apps/store-operations-service/src/workdays/workdays.service.ts

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { UpdateWorkdayDto } from './dto/update-workday.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workday } from './entities/workday.entity';
import { In, Repository } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { WorkdayStatus } from './enums/workday-status.enum';
import { ApproveWorkdayDto } from './dto/approve-workday.dto';
import { UnauthorizedException } from '@nestjs/common';
import { CloseWorkdayDto } from './dto/close-workday.dto';
import { Store } from '../stores/entities/store.entity';


@Injectable()
export class WorkdaysService {
  constructor(
    @InjectRepository(Workday)
    private readonly workdayRepository: Repository<Workday>,

    // Inyectamos StoresService para buscar la tienda
    private readonly storesService: StoresService,
  ) {}

  /**
   * Abre una nueva jornada (Crea un registro)
   */
  async create(createWorkdayDto: CreateWorkdayDto): Promise<Workday> {
    const { storeId, openedByUserId } = createWorkdayDto;

    return await this.workdayRepository.manager.transaction(async transactionalEntityManager => {
      // 1. Buscar y adquirir bloqueo pesimista en la tienda para serializar las operaciones concurrentes de jornada de esta tienda
      const store = await transactionalEntityManager.findOne(Store, {
        where: { id: storeId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!store) {
        throw new NotFoundException(`Tienda con ID "${storeId}" no encontrada.`);
      }

      // 2. Validar que no haya otra jornada abierta o pendiente para esta tienda
      const existingJornada = await transactionalEntityManager.findOne(Workday, {
        where: {
          store: { id: storeId },
          status: In([WorkdayStatus.OPEN, WorkdayStatus.PENDING_APPROVAL]),
        },
      });

      if (existingJornada) {
        throw new BadRequestException(`Ya existe una jornada abierta o pendiente de aprobación para esta tienda.`);
      }

      // 3. Crear la nueva jornada
      const workday = this.workdayRepository.create({
        store: store,
        openedByUserId: openedByUserId,
        status: WorkdayStatus.PENDING_APPROVAL, // Estado inicial
        openedAt: new Date(), // Establece la hora de apertura
      });

      try {
        // 4. Guardar en la base de datos
        return await transactionalEntityManager.save(Workday, workday);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al intentar abrir la jornada');
      }
    });
  }

  findAll() {
    // TODO: Implementar lógica de listado
    return this.workdayRepository.find();
  }

  async findOne(id: string): Promise<Workday> {
    const workday = await this.workdayRepository.findOne({ where: { id } });
    if (!workday) {
      throw new NotFoundException(`Jornada con ID "${id}" no encontrada`);
    }
    return workday;
  }

  /**
   * Aprueba una jornada pendiente.
   */
  async approveWorkday(id: string, approveWorkdayDto: ApproveWorkdayDto): Promise<Workday> {
    const { approvingUserId } = approveWorkdayDto;

    return await this.workdayRepository.manager.transaction(async transactionalEntityManager => {
      // 1. Buscar la jornada con bloqueo pesimista
      const workday = await transactionalEntityManager.findOne(Workday, {
        where: { id },
        relations: ['store'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!workday) {
        throw new NotFoundException(`Jornada con ID "${id}" no encontrada`);
      }

      // 2. Validar el estado
      if (workday.status !== WorkdayStatus.PENDING_APPROVAL) {
        throw new BadRequestException(`La jornada no está pendiente de aprobación (Estado actual: ${workday.status})`);
      }

      // 3. ¡Verificación de autorización!
      if (workday.store.ownerUserId !== approvingUserId) {
        throw new UnauthorizedException('Este usuario no es el dueño de la tienda y no puede aprobar la jornada.');
      }

      // 4. Actualizar el estado y guardar
      workday.status = WorkdayStatus.OPEN;
      workday.approvedByOwnerId = approvingUserId;

      try {
        return await transactionalEntityManager.save(Workday, workday);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al aprobar la jornada.');
      }
    });
  }
  /**
   * Cierra una jornada abierta.
   */
  async closeWorkday(id: string, closeWorkdayDto: CloseWorkdayDto): Promise<Workday> {
    const { closedByUserId } = closeWorkdayDto;

    return await this.workdayRepository.manager.transaction(async transactionalEntityManager => {
      // 1. Buscar la jornada con bloqueo pesimista
      const workday = await transactionalEntityManager.findOne(Workday, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!workday) {
        throw new NotFoundException(`Jornada con ID "${id}" no encontrada`);
      }

      // 2. Validar el estado
      if (workday.status !== WorkdayStatus.OPEN) {
        throw new BadRequestException(`La jornada no puede cerrarse (Estado actual: ${workday.status}). Solo se pueden cerrar jornadas 'ABIERTAS'.`);
      }

      // 3. Actualizar el estado y guardar
      workday.status = WorkdayStatus.CLOSED;
      workday.closedByUserId = closedByUserId;
      workday.closedAt = new Date(); // Registra la hora de cierre

      try {
        return await transactionalEntityManager.save(Workday, workday);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al cerrar la jornada.');
      }
    });
  }

  update(id: string, updateWorkdayDto: UpdateWorkdayDto) {
    // TODO: Implementar lógica de actualización (Aprobar, Cerrar)
    return `This action updates a #${id} workday`;
  }

  remove(id: string) {
    // Generalmente no se eliminan las jornadas
    return `This action removes a #${id} workday`;
  }
}