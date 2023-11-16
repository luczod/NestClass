import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache<T>(
    key: string,
    functionRequest: () => Promise<T>,
  ): Promise<T> {
    const cacheData: T = await this.cacheManager.get(key);

    // check data in cache
    if (cacheData) {
      return cacheData;
    }

    // not found in cache, searche in database
    const dbData: T = await functionRequest();

    // insert in cache
    await this.cacheManager.set(key, dbData);

    return dbData;
  }
}
