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

    // 1. Validar que la tienda exista
    const store = await this.storesService.findOne(storeId);
    // findOne ya lanza NotFoundException si no existe

    // 2. Validar que no haya otra jornada abierta o pendiente para esta tienda
    const existingJornada = await this.workdayRepository.findOne({
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
      return await this.workdayRepository.save(workday);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al intentar abrir la jornada');
    }
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

    // 1. Buscar la jornada (findOne ya incluye la tienda por 'eager: true')
    const workday = await this.findOne(id); // findOne ya lanza NotFoundException

    // 2. Validar el estado
    if (workday.status !== WorkdayStatus.PENDING_APPROVAL) {
      throw new BadRequestException(`La jornada no está pendiente de aprobación (Estado actual: ${workday.status})`);
    }

    // 3. ¡Verificación de autorización!
    // Comprueba que el ID del aprobador coincida con el ID del dueño de la tienda.
    if (workday.store.ownerUserId !== approvingUserId) {
      throw new UnauthorizedException('Este usuario no es el dueño de la tienda y no puede aprobar la jornada.');
    }

    // 4. Actualizar el estado y guardar
    workday.status = WorkdayStatus.OPEN;
    workday.approvedByOwnerId = approvingUserId;

    try {
      return await this.workdayRepository.save(workday);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al aprobar la jornada.');
    }
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