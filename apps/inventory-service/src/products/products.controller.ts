import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'; // 1. Importa UseGuards
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport'; // 2. Importa AuthGuard
// Cerca de los otros imports
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
@UseGuards(AuthGuard('jwt'), RolesGuard) // 1. Añade RolesGuard aquí
@UseGuards(AuthGuard('jwt')) // 3. ¡Añade este decorador!

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.MF_ADMIN) // 2. Solo Admin puede crear
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 3. Todos pueden ver
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 4. Todos pueden ver uno
findOne(@Param('id') id: string) { // Asegúrate de que sea string
  return this.productsService.findOne(id); // Sin el '+'
}

@Patch(':id')
@Roles(Role.MF_ADMIN) // 5. Solo Admin puede actualizar
update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) { // Asegúrate de que sea string
  return this.productsService.update(id, updateProductDto); // Sin el '+'
}

@Delete(':id')
@Roles(Role.MF_ADMIN) // 6. Solo Admin puede eliminar
remove(@Param('id') id: string) { // Asegúrate de que sea string
  return this.productsService.remove(id); // Sin el '+'
}
}
