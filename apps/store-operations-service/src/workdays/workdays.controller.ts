import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { UpdateWorkdayDto } from './dto/update-workday.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApproveWorkdayDto } from './dto/approve-workday.dto';
import { CloseWorkdayDto } from './dto/close-workday.dto';
// Cerca de los otros imports
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
@UseGuards(AuthGuard('jwt'), RolesGuard) // 1. Proteger TODA la clase
@Roles(Role.MF_ADMIN) // 2. Solo Admin puede gestionar tiendas
@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Post()
  @Roles(Role.STAFF_TIENDA, Role.DUENO_TIENDA) // 2. Staff o Dueño pueden abrir
  create(@Body() createWorkdayDto: CreateWorkdayDto) {
    return this.workdaysService.create(createWorkdayDto);
  }

  @Get()
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 5. Todos pueden ver
  findAll() {
    return this.workdaysService.findAll();
  }

  @Get(':id')
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 6. Todos pueden ver
  findOne(@Param('id') id: string) {
    return this.workdaysService.findOne(id);
  }

  // --- NUEVO ENDPOINT PARA APROBAR ---
  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK) // Devuelve 200 OK
  @Roles(Role.DUENO_TIENDA) // 3. Solo el Dueño puede aprobar
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
  @Roles(Role.STAFF_TIENDA, Role.DUENO_TIENDA) // 4. Staff o Dueño pueden cerrar
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
