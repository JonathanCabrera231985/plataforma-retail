// apps/store-operations-service/src/access-logs/access-logs.service.ts

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  update(id: string, updateAccessLogDto: UpdateAccessLogDto) {
    // TODO: Implementar lógica de actualización (Aprobar, Rechazar)
    return `This action updates a #${id} accessLog`;
  }

  remove(id: string) {
    // Generalmente no se eliminan los logs
    return `This action removes a #${id} accessLog`;
  }
}