import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { UpdateWorkdayDto } from './dto/update-workday.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApproveWorkdayDto } from './dto/approve-workday.dto';
import { CloseWorkdayDto } from './dto/close-workday.dto';
@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Post()
  create(@Body() createWorkdayDto: CreateWorkdayDto) {
    return this.workdaysService.create(createWorkdayDto);
  }

  @Get()
  findAll() {
    return this.workdaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workdaysService.findOne(id);
  }

  // --- NUEVO ENDPOINT PARA APROBAR ---
  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK) // Devuelve 200 OK
  approve(
    @Param('id') id: string,
    @Body() approveWorkdayDto: ApproveWorkdayDto,
  ) {
    return this.workdaysService.approveWorkday(id, approveWorkdayDto);
  }
  // ---------------------------------

  // --- NUEVO ENDPOINT PARA CERRAR ---
  @Patch(':id/close')
  @HttpCode(HttpStatus.OK) // Devuelve 200 OK
  close(
    @Param('id') id: string,
    @Body() closeWorkdayDto: CloseWorkdayDto,
  ) {
    return this.workdaysService.closeWorkday(id, closeWorkdayDto);
  }
  // ---------------------------------

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkdayDto: UpdateWorkdayDto) {
    return this.workdaysService.update(id, updateWorkdayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workdaysService.remove(id);
  }
}
