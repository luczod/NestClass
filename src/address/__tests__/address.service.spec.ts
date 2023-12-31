import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressService } from '../address.service';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { AddressEntity } from '../model/address.entity';
import { CityService } from '../../city/city.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntityMock } from '../../city/__mocks__/city.mock';
import { addressEntityMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            find: vi.fn().mockResolvedValue([addressEntityMock]),
            save: vi.fn().mockResolvedValue(addressEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(getRepositoryToken(AddressEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return address after save', async () => {
    const address = await service.createAddress(createAddressMock, userEntityMock.id);

    expect(address).toEqual(addressEntityMock);
  });

  it('should return error if exception in userService', async () => {
    vi.spyOn(userService, 'findUserById').mockRejectedValueOnce(new Error());

    expect(service.createAddress(createAddressMock, userEntityMock.id)).rejects.toThrow();
  });

  it('should return error if exception in cityService', async () => {
    vi.spyOn(cityService, 'findCityById').mockRejectedValueOnce(new Error());

    expect(service.createAddress(createAddressMock, userEntityMock.id)).rejects.toThrow();
  });

  it('should return all address to user', async () => {
    const address = await service.findAddressByUserId(userEntityMock.id);

    expect(address).toEqual([addressEntityMock]);
  });

  it('should return 404 if not address registerd', async () => {
    vi.spyOn(addressRepository, 'find').mockResolvedValue(undefined);

    expect(service.findAddressByUserId(userEntityMock.id)).rejects.toThrow();
  });
});
