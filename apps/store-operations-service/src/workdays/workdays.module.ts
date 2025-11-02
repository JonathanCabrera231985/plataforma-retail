import { Module } from '@nestjs/common';
import { WorkdaysService } from './workdays.service';
import { WorkdaysController } from './workdays.controller';

@Module({
  controllers: [WorkdaysController],
  providers: [WorkdaysService],
})
export class WorkdaysModule {}
