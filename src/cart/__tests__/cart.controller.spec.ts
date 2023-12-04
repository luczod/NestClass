import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { cartMock } from '../__mocks__/cart.mock';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { insertCartMock } from '../__mocks__/insert-cart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: vi.fn().mockResolvedValue(cartMock),
            findCartByUserId: vi.fn().mockResolvedValue(cartMock),
            clearCart: vi.fn().mockResolvedValue(ReturnDeleteMock),
            updateProductInCart: vi.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should cart Entity in createCart', async () => {
    const cart = await controller.createCart(insertCartMock, userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should cart Entity in findCartByUserId', async () => {
    const cart = await controller.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });

  it('should return DeleteResult in clearCart', async () => {
    const cart = await controller.clearCart(userEntityMock.id);

    expect(cart).toEqual(ReturnDeleteMock);
  });

  it('should cart Entity in updateProductInCart', async () => {
    const cart = await controller.updateProductInCart(updateCartMock, userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
    });
  });
});
