import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreOpsReportsService } from './store-ops-reports.service';
import { CreateStoreOpsReportDto } from './dto/create-store-ops-report.dto';
import { UpdateStoreOpsReportDto } from './dto/update-store-ops-report.dto';

@Controller('store-ops-reports')
export class StoreOpsReportsController {
  constructor(private readonly storeOpsReportsService: StoreOpsReportsService) {}

  @Post()
  create(@Body() createStoreOpsReportDto: CreateStoreOpsReportDto) {
    return this.storeOpsReportsService.create(createStoreOpsReportDto);
  }

  @Get()
  findAll() {
    return this.storeOpsReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeOpsReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreOpsReportDto: UpdateStoreOpsReportDto) {
    return this.storeOpsReportsService.update(id, updateStoreOpsReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeOpsReportsService.remove(id);
  }
}
