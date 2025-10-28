// apps/iam-service/src/users/users.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // 1. Importar UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; // 2. Importar AuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // 3. Importar RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // 4. Importar Decorador
import { Role } from '../common/enums/role.enum'; // 5. Importar Enum

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // 6. Aplicar la protección
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Primero autentica, luego autoriza
  @Roles(Role.MF_ADMIN) // 7. Solo permitir este rol
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}