import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { UserService } from '../../user/user.service';
import { AddressEntity } from '../model/address.entity';
import { CityService } from '../../city/city.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntityMock } from '../../city/__mocks__/city.mock';
import { addressEntityMock } from '../__mocks__/address.mock';

describe('AddressController', () => {
  let controller: AddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        AddressService,
        {
          provide: UserService,
          useValue: {
            findUserById: vi.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: vi.fn().mockResolvedValue(CityEntityMock),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: vi.fn().mockResolvedValue(addressEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
