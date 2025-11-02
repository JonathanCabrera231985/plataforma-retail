import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesReportsService } from './sales-reports.service';
import { CreateSalesReportDto } from './dto/create-sales-report.dto';
import { UpdateSalesReportDto } from './dto/update-sales-report.dto';

@Controller('sales-reports')
export class SalesReportsController {
  constructor(private readonly salesReportsService: SalesReportsService) {}

  @Post()
  create(@Body() createSalesReportDto: CreateSalesReportDto) {
    return this.salesReportsService.create(createSalesReportDto);
  }

  @Get()
  findAll() {
    return this.salesReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesReportDto: UpdateSalesReportDto) {
    return this.salesReportsService.update(id, updateSalesReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesReportsService.remove(id);
  }
}
