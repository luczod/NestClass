import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityEntity } from './model/city.entity';

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
