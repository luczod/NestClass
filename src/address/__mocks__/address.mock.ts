import { CityEntityMock } from '../../city/__mocks__/city.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AddressEntity } from '../model/address.entity';

export const addressEntityMock: AddressEntity = {
  cep: '43253252',
  cityId: CityEntityMock.id,
  complement: 'llkdfja',
  createdAt: new Date(),
  id: 57546,
  numberAddress: 654,
  updatedAt: new Date(),
  userId: userEntityMock.id,
};
