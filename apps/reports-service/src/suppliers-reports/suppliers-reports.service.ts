import { Injectable } from '@nestjs/common';
import { CreateSuppliersReportDto } from './dto/create-suppliers-report.dto';
import { UpdateSuppliersReportDto } from './dto/update-suppliers-report.dto';

@Injectable()
export class SuppliersReportsService {
  create(createSuppliersReportDto: CreateSuppliersReportDto) {
    return 'This action adds a new suppliersReport';
  }

  findAll() {
    return `This action returns all suppliersReports`;
  }

  findOne(id: string) {
    return `This action returns a #${id} suppliersReport`;
  }

  update(id: string, updateSuppliersReportDto: UpdateSuppliersReportDto) {
    return `This action updates a #${id} suppliersReport`;
  }

  remove(id: string) {
    return `This action removes a #${id} suppliersReport`;
  }
}
