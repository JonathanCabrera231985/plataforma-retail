import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkdaysService } from './workdays.service';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { UpdateWorkdayDto } from './dto/update-workday.dto';

@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Post()
  create(@Body() createWorkdayDto: CreateWorkdayDto) {
    return this.workdaysService.create(createWorkdayDto);
  }

  @Get()
  findAll() {
    return this.workdaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workdaysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkdayDto: UpdateWorkdayDto) {
    return this.workdaysService.update(id, updateWorkdayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workdaysService.remove(id);
  }
}
