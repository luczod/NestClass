import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CacheService } from '../cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { Cache } from 'cache-manager';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => userEntityMock,
            set: () => vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data in cache', async () => {
    const user = await service.getCache('key', () => null);

    expect(user).toEqual(userEntityMock);
  });

  it('should return data in function', async () => {
    const result = { test: 'spec' };
    vi.spyOn(cacheManager, 'get').mockResolvedValue(undefined);

    const user = await service.getCache('key', () => Promise.resolve(result));

    expect(user).toEqual(result);
  });
});
