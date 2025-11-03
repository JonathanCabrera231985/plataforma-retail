import { Injectable } from '@nestjs/common';
import { CreateStoreOpsReportDto } from './dto/create-store-ops-report.dto';
import { UpdateStoreOpsReportDto } from './dto/update-store-ops-report.dto';

@Injectable()
export class StoreOpsReportsService {
  create(createStoreOpsReportDto: CreateStoreOpsReportDto) {
    return 'This action adds a new storeOpsReport';
  }

  findAll() {
    return `This action returns all storeOpsReports`;
  }

  findOne(id: string) {
    return `This action returns a #${id} storeOpsReport`;
  }

  update(id: string, updateStoreOpsReportDto: UpdateStoreOpsReportDto) {
    return `This action updates a #${id} storeOpsReport`;
  }

  remove(id: string) {
    return `This action removes a #${id} storeOpsReport`;
  }
}
