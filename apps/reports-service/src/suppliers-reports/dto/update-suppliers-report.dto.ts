import { PartialType } from '@nestjs/mapped-types';
import { CreateSuppliersReportDto } from './create-suppliers-report.dto';

export class UpdateSuppliersReportDto extends PartialType(CreateSuppliersReportDto) {}
