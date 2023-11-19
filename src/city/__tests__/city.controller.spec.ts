import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from '../city.controller';
import { Repository } from 'typeorm';
import { CityEntity } from '../model/city.entity';
import { CityService } from '../city.service';
import { CacheService } from '../../cache/cache.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntityMock } from '../__mocks__/city.mock';

describe('CityController', () => {
  let controller: CityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(CityEntityMock),
            save: jest.fn().mockResolvedValue(CityEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
