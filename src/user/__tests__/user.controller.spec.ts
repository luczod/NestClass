import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import { updatePasswordMock } from '../__mocks__/update-user.mock';
import { ReturnUserDto } from '../dtos/returnUser.dto';
import { UserType } from '../enum/userType.enum';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: vi.fn().mockResolvedValue(userEntityMock),
            updatePasswordUser: vi.fn().mockResolvedValue(userEntityMock),
            getUserByIdUsingRelations: vi.fn().mockResolvedValue(userEntityMock),
            getAllUser: vi.fn().mockResolvedValue([userEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user Entity in createUser', async () => {
    const user = await controller.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
  });

  it('should return user Entity in createUserAdmin', async () => {
    const spy = vi.spyOn(userService, 'createUser');
    const user = await controller.createAdmUser(createUserMock);

    expect(user).toEqual(userEntityMock);
    expect(spy.mock.calls[0][1]).equal(UserType.Admin);
  });

  it('should return ReturnUser in getAllUser', async () => {
    const users = await controller.getAllUsers();

    expect(users).toEqual([
      {
        id: userEntityMock.id,
        name: userEntityMock.name,
        email: userEntityMock.email,
        phone: userEntityMock.phone,
        cpf: userEntityMock.cpf,
      },
    ]);
  });

  it('should return ID by decorator UserId', async () => {
    const user = await controller.getUserById(userEntityMock.id);

    expect(user).toEqual({
      id: userEntityMock.id,
      name: userEntityMock.name,
      email: userEntityMock.email,
      phone: userEntityMock.phone,
      cpf: userEntityMock.cpf,
    });
  });

  it('should return UserEntity in updatePasswordUser', async () => {
    const user = await controller.updatePasswordUser(updatePasswordMock, userEntityMock.id);

    expect(user).toEqual(userEntityMock);
  });

  it('should return UserEntity in getInfoUser', async () => {
    const user = await controller.getInfoUser(userEntityMock.id);

    expect(user).toEqual(new ReturnUserDto(userEntityMock));
  });
});
