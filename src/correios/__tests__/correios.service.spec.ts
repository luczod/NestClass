import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CorreiosService } from '../correios.service';
import { Client } from 'nestjs-soap';
import { CityService } from 'src/city/city.service';
import { HttpService } from '@nestjs/axios';

describe('CorreiosService', () => {
  let service: CorreiosService;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CorreiosService,
          useValue: {
            findAddressByCep: vi.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<CorreiosService>(CorreiosService);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(correiosService).toBeDefined();
  });
});
