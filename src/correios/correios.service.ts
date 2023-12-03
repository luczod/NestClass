import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { CityService } from '../city/city.service';
import { ReturnCepExternal } from './dtos/return-cep-external.dto';
import { ReturnCep } from './dtos/return-cep.dto';
import { CityEntity } from '../city/model/city.entity';
import { ResPriceCorreios } from './dtos/response-price-correios';
import { Client } from 'nestjs-soap';
@Injectable()
export class CorreiosService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;

  constructor(
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  async findAddressByCEP(cep: string): Promise<ReturnCep> {
    const returnCep: ReturnCepExternal = await this.httpService.axiosRef
      .get<ReturnCepExternal>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException('CEP not found');
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Error in connection request ${error.message}`);
      });

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);

    // console.log('city', city);

    return new ReturnCep(returnCep, city?.id, city?.state?.id);
  }

  async priceDelivery(): Promise<ResPriceCorreios> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo(
        {
          nCdServico: '40010',
          sCepOrigem: '22270010',
          sCepDestino: '89010000',
          nVlPeso: 2,
          nCdFormato: 1,
          nVlComprimento: 30,
          nVlAltura: 30,
          nVlLargura: 30,
          nVlDiametro: 30,
          nCdEmpresa: '',
          sDsSenha: '',
          sCdMaoPropria: 'N',
          nVlValorDeclarado: 0,
          sCdAvisoRecebimento: 'N',
        },
        (_, res: ResPriceCorreios) => {
          if (res) {
            resolve(res);
          } else {
            throw new BadRequestException('Error SOAP');
          }
        },
      );
    });
  }
}
