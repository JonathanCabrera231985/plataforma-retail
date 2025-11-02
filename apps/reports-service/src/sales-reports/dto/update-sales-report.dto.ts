import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesReportDto } from './create-sales-report.dto';

export class UpdateSalesReportDto extends PartialType(CreateSalesReportDto) {}
