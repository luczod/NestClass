import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class CorreiosService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;

  constructor(private readonly httpService: HttpService) {}

  async findAddressByCEP(cep: string): Promise<AxiosResponse<any>> {
    try {
      const res = await this.httpService.axiosRef.get(this.URL_CORREIOS.replace('{CEP}', cep));
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BadRequestException(error.message);
      }
      console.log(error);
    }
  }
}
