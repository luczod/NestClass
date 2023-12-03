import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from './model/city.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`, () =>
      this.cityRepository.find({
        where: {
          stateId,
        },
      }),
    );
  }

  async findCityById(cityId: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        id: cityId,
      },
    });

    if (!city) {
      throw new NotFoundException(`cityId: ${cityId} not found`);
    }

    return city;
  }

  async findCityByName(nameCity: string, nameState: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        name: nameCity,
        state: {
          uf: nameState,
        },
      },
      relations: {
        state: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`City not found.`);
    }

    return city;
  }
}
