import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuppliersReportsService } from './suppliers-reports.service';
import { CreateSuppliersReportDto } from './dto/create-suppliers-report.dto';
import { UpdateSuppliersReportDto } from './dto/update-suppliers-report.dto';

@Controller('suppliers-reports')
export class SuppliersReportsController {
  constructor(private readonly suppliersReportsService: SuppliersReportsService) {}

  @Post()
  create(@Body() createSuppliersReportDto: CreateSuppliersReportDto) {
    return this.suppliersReportsService.create(createSuppliersReportDto);
  }

  @Get()
  findAll() {
    return this.suppliersReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuppliersReportDto: UpdateSuppliersReportDto) {
    return this.suppliersReportsService.update(id, updateSuppliersReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersReportsService.remove(id);
  }
}
