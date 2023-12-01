import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { addressEntityMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: vi.fn().mockResolvedValue(addressEntityMock),
            findAddressByUserId: vi.fn().mockResolvedValue([addressEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should address Entity in createAddress', async () => {
    const address = await controller.createAddress(createAddressMock, userEntityMock.id);

    expect(address).toEqual(addressEntityMock);
  });

  it('should address Entity in findAddressByUserId', async () => {
    const addresses = await controller.findAddressByUserId(userEntityMock.id);

    expect(addresses).toEqual([
      {
        id: addressEntityMock.id,
        complement: addressEntityMock.complement,
        city: addressEntityMock.city,
        numberAddress: addressEntityMock.numberAddress,
        cep: addressEntityMock.cep,
      },
    ]);
  });
});
