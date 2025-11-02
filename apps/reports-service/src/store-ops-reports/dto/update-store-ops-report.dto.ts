import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreOpsReportDto } from './create-store-ops-report.dto';

export class UpdateStoreOpsReportDto extends PartialType(CreateStoreOpsReportDto) {}
