import { Test, TestingModule } from '@nestjs/testing';
import { RentalPaymentsController } from './rental-payments.controller';
import { RentalPaymentsService } from './rental-payments.service';

describe('RentalPaymentsController', () => {
  let controller: RentalPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalPaymentsController],
      providers: [
        {
          provide: RentalPaymentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RentalPaymentsController>(RentalPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
