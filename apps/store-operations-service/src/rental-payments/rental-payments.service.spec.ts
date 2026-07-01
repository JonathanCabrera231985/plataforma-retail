import { Test, TestingModule } from '@nestjs/testing';
import { RentalPaymentsService } from './rental-payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RentalPayment } from './entities/rental-payment.entity';
import { StoresService } from '../stores/stores.service';

describe('RentalPaymentsService', () => {
  let service: RentalPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalPaymentsService,
        {
          provide: getRepositoryToken(RentalPayment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: StoresService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RentalPaymentsService>(RentalPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
