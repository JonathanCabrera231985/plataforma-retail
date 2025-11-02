import { Injectable } from '@nestjs/common';
import { CreateInventoryReportDto } from './dto/create-inventory-report.dto';
import { UpdateInventoryReportDto } from './dto/update-inventory-report.dto';

@Injectable()
export class InventoryReportsService {
  create(createInventoryReportDto: CreateInventoryReportDto) {
    return 'This action adds a new inventoryReport';
  }

  findAll() {
    return `This action returns all inventoryReports`;
  }

  findOne(id: string) {
    return `This action returns a #${id} inventoryReport`;
  }

  update(id: string, updateInventoryReportDto: UpdateInventoryReportDto) {
    return `This action updates a #${id} inventoryReport`;
  }

  remove(id: string) {
    return `This action removes a #${id} inventoryReport`;
  }
}
