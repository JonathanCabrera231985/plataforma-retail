// apps/suppliers-service/src/suppliers/suppliers.service.ts

import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
// ... (probablemente falten imports de TypeORM aquí)

@Injectable()
export class SuppliersService {

  // (Aquí irá tu constructor con @InjectRepository)

  create(createSupplierDto: CreateSupplierDto) {
    return 'This action adds a new supplier';
  }

  findAll() {
    return `This action returns all suppliers`;
  }

  // --- CORRECCIÓN AQUÍ ---
  findOne(id: string) { // Cambia 'number' a 'string'
    return `This action returns a #${id} supplier`;
  }

  // --- CORRECCIÓN AQUÍ ---
  update(id: string, updateSupplierDto: UpdateSupplierDto) { // Cambia 'number' a 'string'
    return `This action updates a #${id} supplier`;
  }

  // --- CORRECCIÓN AQUÍ ---
  remove(id: string) { // Cambia 'number' a 'string'
    return `This action removes a #${id} supplier`;
  }
}