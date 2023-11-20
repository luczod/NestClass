import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CityController } from '../city.controller';
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
            getCache: vi.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: vi.fn().mockResolvedValue(CityEntityMock),
            save: vi.fn().mockResolvedValue(CityEntityMock),
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
