import { Test, TestingModule } from '@nestjs/testing';
import { AttributesService } from './attributes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';

describe('AttributesService', () => {
  let service: AttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributesService,
        {
          provide: getRepositoryToken(Attribute),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttributesService>(AttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
