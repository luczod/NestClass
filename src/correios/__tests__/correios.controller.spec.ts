import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CorreiosController } from '../correios.controller';
import { CityService } from 'src/city/city.service';
import { HttpService } from '@nestjs/axios';
import { CorreiosService } from '../correios.service';

describe('CorreiosController', () => {
  let controller: CorreiosController;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorreiosController],
      providers: [
        {
          provide: CorreiosService,
          useValue: {
            findAddressByCep: vi.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(correiosService).toBeDefined();
  });
});
