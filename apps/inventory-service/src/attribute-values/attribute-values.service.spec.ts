import { Test, TestingModule } from '@nestjs/testing';
import { AttributeValuesService } from './attribute-values.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttributeValue } from './entities/attribute-value.entity';
import { AttributesService } from '../attributes/attributes.service';

describe('AttributeValuesService', () => {
  let service: AttributeValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributeValuesService,
        {
          provide: getRepositoryToken(AttributeValue),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: AttributesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttributeValuesService>(AttributeValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
