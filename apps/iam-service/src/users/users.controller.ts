// apps/iam-service/src/auth/auth.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common'; // 1. Importar UseGuards
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport'; // 2. Importar AuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // 3. Importar RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // 4. Importar Decorador
import { Role } from '../common/enums/role.enum'; // 5. Importar Enum

@Controller('auth') // Ruta base: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  // 6. Aplicar la protección
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Primero autentica, luego autoriza
  @Roles(Role.MF_ADMIN) // 7. Solo permitir este rol
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}