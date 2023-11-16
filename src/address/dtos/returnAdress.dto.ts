import { CityEntity } from 'src/city/model/city.entity';
import { AddressEntity } from '../model/address.entity';

export class ReturnAddressDto {
  complemet: string;
  numberAdress: number;
  cep: string;
  city: CityEntity;

  constructor(address: AddressEntity) {
    this.complemet = address.complement;
    this.numberAdress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city;
  }
}
