import { Test, TestingModule } from '@nestjs/testing';
import { RentalPaymentsService } from './rental-payments.service';

describe('RentalPaymentsService', () => {
  let service: RentalPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalPaymentsService],
    }).compile();

    service = module.get<RentalPaymentsService>(RentalPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
