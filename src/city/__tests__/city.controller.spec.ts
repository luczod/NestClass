import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CityController } from '../city.controller';
import { CityService } from '../city.service';
import { CityEntityMock } from '../__mocks__/city.mock';
import { StateEntityMock } from '../../state/__mocks__/state.mock';

describe('CityController', () => {
  let controller: CityController;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: {
            getAllCitiesByStateId: vi.fn().mockResolvedValue([CityEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    cityService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cityService).toBeDefined();
  });

  it('should return city Entity in getAllCitiesByStateId', async () => {
    const city = await controller.getAllCitiesByStateid(StateEntityMock.id);

    expect(city).toEqual([CityEntityMock]);
  });
});
