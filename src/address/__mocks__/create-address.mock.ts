import { CityEntityMock } from '../../city/__mocks__/city.mock';
import { CreateAddressDto } from '../dtos/createAddress.dto';
import { addressEntityMock } from './address.mock';

export const createAddressMock: CreateAddressDto = {
  cep: addressEntityMock.cep,
  cityId: CityEntityMock.id,
  complement: addressEntityMock.complement,
  numberAddress: addressEntityMock.numberAddress,
};
