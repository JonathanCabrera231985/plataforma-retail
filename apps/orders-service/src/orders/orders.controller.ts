import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// Cerca de los otros imports
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
@UseGuards(AuthGuard('jwt'), RolesGuard) // 1. Proteger TODA la clase
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.MF_ADMIN, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 2. Roles para crear
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 3. Roles para ver
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS, Role.DUENO_TIENDA, Role.STAFF_TIENDA) // 4. Roles para ver uno
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS) // 5. Roles para actualizar (ej. cancelar)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS) // 6. Roles para eliminar
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
