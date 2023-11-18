import { ReturnCityDto } from '../../city/dtos/returnCity.dto';
import { AddressEntity } from '../model/address.entity';

export class ReturnAddressDto {
  complemet: string;
  numberAdress: number;
  cep: string;
  city?: ReturnCityDto;

  constructor(address: AddressEntity) {
    this.complemet = address.complement;
    this.numberAdress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city ? new ReturnCityDto(address.city) : undefined;
  }
}
