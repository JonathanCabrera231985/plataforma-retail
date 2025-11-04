import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
// ... (imports)
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
@UseGuards(AuthGuard('jwt'), RolesGuard) // 1. Proteger TODA la clase
@Controller('access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Post()
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS) // 2. Personal de MF solicita ingreso
  create(@Body() createAccessLogDto: CreateAccessLogDto) {
    return this.accessLogsService.create(createAccessLogDto);
  }

  @Patch(':id')
  @Roles(Role.DUENO_TIENDA) // 3. Dueño de Tienda aprueba/rechaza
  update(@Param('id') id: string, @Body() updateAccessLogDto: UpdateAccessLogDto) {
    return this.accessLogsService.update(id, updateAccessLogDto);
  }

  @Get()
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS, Role.DUENO_TIENDA) // 4. Todos pueden ver
  findAll() {
    return this.accessLogsService.findAll();
  }

  @Get(':id')
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS, Role.DUENO_TIENDA) // 5. Todos pueden ver
  findOne(@Param('id') id: string) {
    return this.accessLogsService.findOne(id);
  }
  // ...
}