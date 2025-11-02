import { Injectable } from '@nestjs/common';
import { CreateSalesReportDto } from './dto/create-sales-report.dto';
import { UpdateSalesReportDto } from './dto/update-sales-report.dto';

@Injectable()
export class SalesReportsService {
  create(createSalesReportDto: CreateSalesReportDto) {
    return 'This action adds a new salesReport';
  }

  findAll() {
    return `This action returns all salesReports`;
  }

  findOne(id: string) {
    return `This action returns a #${id} salesReport`;
  }

  update(id: string, updateSalesReportDto: UpdateSalesReportDto) {
    return `This action updates a #${id} salesReport`;
  }

  remove(id: string) {
    return `This action removes a #${id} salesReport`;
  }
}
