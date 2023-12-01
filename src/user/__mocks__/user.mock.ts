import { UserType } from '../enum/userType.enum';
import { UserEntity } from '../model/user.entity';

export const userEntityMock: UserEntity = {
  cpf: '1235468998',
  createdAt: new Date(),
  email: 'emailmock@emal.com',
  id: 456,
  name: 'nameMock',
  password: '$2b$10$S62WmVpIxL52Z.0y22DWfuaAz8.XUNESChWP.AlMFZnOJ9n9uiqi.',
  phone: '312165498',
  typeUser: UserType.User,
  updatedAt: new Date(),
};
