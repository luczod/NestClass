import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartService } from '../cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartEntity } from '../model/cart.entity';
import { Repository } from 'typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { cartMock } from '../__mocks__/cart.mock';
import { insertCartMock } from '../__mocks__/insert-cart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue: {
            insertProductInCart: vi.fn().mockResolvedValue(undefined),
            deleteProductCart: vi.fn().mockResolvedValue(ReturnDeleteMock),
            updateProductInCart: vi.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            save: vi.fn().mockResolvedValue(cartMock),
            findOne: vi.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartProductService = module.get<CartProductService>(CartProductService);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductService).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  it('should return cart in cart not found (insertProductInCart)', async () => {
    vi.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);
    const spy = vi.spyOn(cartRepository, 'save');
    const spyCartProductService = vi.spyOn(cartProductService, 'insertProductInCart');

    const cart = await service.insertProductInCart(insertCartMock, userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
  });

  it('should return cart in cart found (insertProductInCart)', async () => {
    const spy = vi.spyOn(cartRepository, 'save');
    const spyCartProductService = vi.spyOn(cartProductService, 'insertProductInCart');

    const cart = await service.insertProductInCart(insertCartMock, userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls.length).toEqual(0);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
  });

  it('should return DeleteResult in deleteProductCart', async () => {
    const spy = vi.spyOn(cartProductService, 'deleteProductCart');
    const deleteResult = await service.deleteProductCart(productMock.id, userEntityMock.id);

    expect(deleteResult).toEqual(ReturnDeleteMock);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return NotFoundException in cart not exist', async () => {
    vi.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
    const spy = vi.spyOn(cartProductService, 'deleteProductCart');

    expect(service.deleteProductCart(productMock.id, userEntityMock.id)).rejects.toThrowError(
      NotFoundException,
    );
    expect(spy.mock.calls.length).toEqual(0);
  });

  it('should return DeleteResult in deleteProductCart', async () => {
    const spy = vi.spyOn(cartProductService, 'deleteProductCart');
    const deleteResult = await service.deleteProductCart(productMock.id, userEntityMock.id);

    expect(deleteResult).toEqual(ReturnDeleteMock);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return NotFoundException in cart not exist', async () => {
    vi.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
    const spy = vi.spyOn(cartProductService, 'deleteProductCart');

    expect(service.deleteProductCart(productMock.id, userEntityMock.id)).rejects.toThrowError(
      NotFoundException,
    );
    expect(spy.mock.calls.length).toEqual(0);
  });

  it('should return cart in updateProductInCart', async () => {
    const spyCartProductService = vi.spyOn(cartProductService, 'updateProductInCart');
    const spySave = vi.spyOn(cartRepository, 'save');
    const cart = await service.updateProductInCart(updateCartMock, userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(0);
  });

  it('should return cart in createCart', async () => {
    vi.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    const spySave = vi.spyOn(cartRepository, 'save');
    const cart = await service.updateProductInCart(updateCartMock, userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spySave.mock.calls.length).toEqual(1);
  });
});
