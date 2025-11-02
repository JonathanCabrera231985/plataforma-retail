// apps/store-operations-service/src/access-logs/access-logs.service.ts

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException , UnauthorizedException} from '@nestjs/common';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessLog } from './entities/access-log.entity';
import { Repository } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { AccessStatus } from './enums/access-status.enum';

@Injectable()
export class AccessLogsService {
  constructor(
    @InjectRepository(AccessLog)
    private readonly accessLogRepository: Repository<AccessLog>,

    // Inyectamos StoresService para buscar la tienda
    private readonly storesService: StoresService,
  ) {}

  /**
   * Registra una nueva solicitud de ingreso
   */
  async create(createAccessLogDto: CreateAccessLogDto): Promise<AccessLog> {
    const { storeId, mfUserId, purpose } = createAccessLogDto;

    // 1. Validar que la tienda exista
    const store = await this.storesService.findOne(storeId);
    // findOne ya lanza NotFoundException si no existe

    // 2. Crear el nuevo registro de acceso
    const accessLog = this.accessLogRepository.create({
      store: store,
      mfUserId: mfUserId,
      purpose: purpose,
      status: AccessStatus.PENDING, // Estado inicial
      entryTime: new Date(),
    });

    try {
      // 3. Guardar en la base de datos
      return await this.accessLogRepository.save(accessLog);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al registrar el ingreso');
    }
  }

  findAll(): Promise<AccessLog[]> {
    // Carga los logs con sus tiendas gracias a 'eager: true'
    return this.accessLogRepository.find();
  }

  async findOne(id: string): Promise<AccessLog> {
    const accessLog = await this.accessLogRepository.findOne({ where: { id } });
    if (!accessLog) {
      throw new NotFoundException(`Registro de acceso con ID "${id}" no encontrado`);
    }
    return accessLog;
  }

 /**
   * Aprueba o rechaza una solicitud de ingreso
   */
  async update(id: string, updateAccessLogDto: UpdateAccessLogDto): Promise<AccessLog> {
    const { approvingUserId, status } = updateAccessLogDto;

    // 1. Buscar el registro de acceso (findOne carga la tienda)
    const accessLog = await this.findOne(id);

    // 2. Validar el estado
    if (accessLog.status !== AccessStatus.PENDING) {
      throw new BadRequestException(`Este registro de acceso ya fue procesado (Estado actual: ${accessLog.status})`);
    }

    // 3. ¡Verificación de Autorización!
    // Comprueba que el ID del aprobador coincida con el ID del dueño de la tienda.
    if (accessLog.store.ownerUserId !== approvingUserId) {
      throw new UnauthorizedException('Este usuario no es el dueño de la tienda y no puede aprobar este ingreso.');
    }

    // 4. Actualizar el estado y guardar
    accessLog.status = status;
    accessLog.approvedByOwnerId = approvingUserId;

    try {
      return await this.accessLogRepository.save(accessLog);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el registro de acceso.');
    }
  }

  remove(id: string) {
    // Generalmente no se eliminan los logs
    return `This action removes a #${id} accessLog`;
  }
}