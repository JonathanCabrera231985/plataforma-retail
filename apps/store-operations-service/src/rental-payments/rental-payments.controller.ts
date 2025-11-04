import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalPaymentsService } from './rental-payments.service';
import { CreateRentalPaymentDto } from './dto/create-rental-payment.dto';
import { UpdateRentalPaymentDto } from './dto/update-rental-payment.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { MarkAsPaidDto } from './dto/mark-as-paid.dto';
// ... (imports)
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';


@UseGuards(AuthGuard('jwt'), RolesGuard) // 1. Proteger TODA la clase
@Controller('rental-payments')
export class RentalPaymentsController {
  constructor(private readonly rentalPaymentsService: RentalPaymentsService) {}

  @Post()
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS) // 2. Solo MF registra pagos
  create(@Body() createRentalPaymentDto: CreateRentalPaymentDto) {
    return this.rentalPaymentsService.create(createRentalPaymentDto);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS) // 3. Solo MF aprueba
  approve(
    @Param('id') id: string,
    @Body() approvePaymentDto: ApprovePaymentDto,
  ) {
    return this.rentalPaymentsService.approve(id, approvePaymentDto);
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS) // 4. Solo MF marca como pagado
  markAsPaid(
    @Param('id') id: string,
    @Body() markAsPaidDto: MarkAsPaidDto,
  ) {
    return this.rentalPaymentsService.markAsPaid(id, markAsPaidDto);
  }

  @Get()
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS, Role.DUENO_TIENDA) // 5. Dueño puede ver
  findAll() {
    return this.rentalPaymentsService.findAll();
  }

  @Get(':id')
  @Roles(Role.MF_ADMIN, Role.MF_FINANZAS, Role.DUENO_TIENDA) // 6. Dueño puede ver
  findOne(@Param('id') id: string) {
    return this.rentalPaymentsService.findOne(id);
  }
  // ...
}