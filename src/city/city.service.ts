import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from './model/city.entity';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    const citiesCache: CityEntity[] = await this.cacheManager.get(
      `state_${stateId}`,
    );

    // check data in cache
    if (citiesCache) {
      return citiesCache;
    }

    // not found in cache, searche in database
    const cities = await this.cityRepository.find({
      where: {
        stateId,
      },
    });

    // insert in cache
    await this.cacheManager.set(`state_${stateId}`, cities);

    return cities;
  }
}
