import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'; // 1. Importa UseGuards
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport'; // 2. Importa AuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // Importar
import { Roles } from '../auth/decorators/roles.decorator'; // Importar
import { Role } from '../auth/enums/role.enum'; // Importar
@UseGuards(AuthGuard('jwt'), RolesGuard) // 1. Añade RolesGuard
@UseGuards(AuthGuard('jwt')) // 3. ¡Añade este decorador!
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.MF_ADMIN) // 2. Solo Admin
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 3. Todos
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 4. Todos
  findOne(@Param('id') id: string) {
    // SIN EL '+'
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MF_ADMIN) // 5. Solo Admin
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    // SIN EL '+'
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.MF_ADMIN) // 6. Solo Admin
  remove(@Param('id') id: string) {
    // SIN EL '+'
    return this.categoriesService.remove(id);
  }
}