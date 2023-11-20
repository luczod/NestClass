import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { userEntityMock } from '../__mocks__/user.mock';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: vi.fn().mockResolvedValue(userEntityMock),
            save: vi.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
