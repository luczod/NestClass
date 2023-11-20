import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CityService } from '../city.service';
import { Repository } from 'typeorm';
import { CityEntity } from '../model/city.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntityMock } from '../__mocks__/city.mock';
import { CacheService } from '../../cache/cache.service';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: vi.fn().mockResolvedValue([CityEntityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: vi.fn().mockResolvedValue(CityEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  //---------------------findCityById--------------------

  it('should return one city in findCityById', async () => {
    const city = await service.findCityById(CityEntityMock.id);

    expect(city).toEqual(CityEntityMock);
  });

  it('should return error in findCityById', async () => {
    vi.spyOn(cityRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCityById(CityEntityMock.id)).rejects.toThrow();
  });

  it('should return error in findCityById ON Request', async () => {
    vi.spyOn(cityRepository, 'findOne').mockRejectedValueOnce(new Error());

    expect(service.findCityById(CityEntityMock.id)).rejects.toThrow();
  });

  //---------------------getAllCitiesByStateId--------------------

  it('should return cities in getAllCitiesByStateId', async () => {
    const cities = await service.getAllCitiesByStateId(CityEntityMock.stateId);

    expect(cities).toEqual([CityEntityMock]);
  });
});
