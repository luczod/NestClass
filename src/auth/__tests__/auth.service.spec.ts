import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mocks__/jwt.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { loginUserMock } from '../__mocks__/login-user.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: vi.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if password and email valid', async () => {
    const user = await service.login(loginUserMock);

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDto(userEntityMock),
    });
  });

  it('should return user if password invalid and email valid', async () => {
    expect(service.login({ ...loginUserMock, password: '4324' })).rejects.toThrow();
  });

  it('should return user if email not exist', async () => {
    vi.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    expect(service.login(loginUserMock)).rejects.toThrow();
  });

  it('should return error in UserService', async () => {
    vi.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    expect(service.login(loginUserMock)).rejects.toThrow();
  });
});
