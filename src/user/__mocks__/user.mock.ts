import { UserType } from '../enum/userType.enum';
import { UserEntity } from '../model/user.entity';

export const userEntityMock: UserEntity = {
  cpf: '1235468998',
  createdAt: new Date(),
  email: 'emailmock@emali.com',
  id: 456,
  name: 'nameMock',
  password: 'large',
  phone: '312165498',
  typeUser: UserType.User,
  updatedAt: new Date(),
};
