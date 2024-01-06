import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCep } from './dtos/return-cep.dto';
import { ResPriceCorreios } from './dtos/response-price-correios';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Correios')
@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/price')
  async priceDelivery(): Promise<ResPriceCorreios> {
    return this.correiosService.priceDelivery();
  }

  @Get('/:cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCep> {
    return this.correiosService.findAddressByCEP(cep);
  }
}
