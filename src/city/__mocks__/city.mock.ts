import { StateEntityMock } from '../../state/__mocks__/state.mock';
import { CityEntity } from '../model/city.entity';

export const CityEntityMock: CityEntity = {
  id: 25,
  name: 'nome da cidade',
  stateId: StateEntityMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
