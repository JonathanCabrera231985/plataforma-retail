import { Injectable } from '@nestjs/common';
import { CreateWorkdayDto } from './dto/create-workday.dto';
import { UpdateWorkdayDto } from './dto/update-workday.dto';

@Injectable()
export class WorkdaysService {
  create(createWorkdayDto: CreateWorkdayDto) {
    return 'This action adds a new workday';
  }

  findAll() {
    return `This action returns all workdays`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workday`;
  }

  update(id: number, updateWorkdayDto: UpdateWorkdayDto) {
    return `This action updates a #${id} workday`;
  }

  remove(id: number) {
    return `This action removes a #${id} workday`;
  }
}
