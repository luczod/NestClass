import { Controller, Get, Param } from '@nestjs/common';
import { CityEntity } from './model/city.entity';
import { CityService } from './city.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/:stateId')
  async getAllCitiesByStateid(@Param('stateId') stateId: number): Promise<CityEntity[]> {
    return this.cityService.getAllCitiesByStateId(stateId);
  }
}
