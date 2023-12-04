import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CartProductService } from '../cart-product.service';
import { CartProductEntity } from '../model/cart-product.entity';
import { ProductService } from '../../product/product.service';
import { productMock } from '../../product/__mocks__/product.mock';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { cartProductMock } from '../__mocks__/cart-product.mock';
import { insertCartMock } from '../../cart/__mocks__/insert-cart.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from '../../cart/__mocks__/update-cart.mock';
import { ReturnCartProductDTO } from '../dtos/return-cart-product.dto';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: ProductService,
          useValue: { findProductById: vi.fn().mockResolvedValue(productMock) },
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: vi.fn().mockResolvedValue(cartProductMock),
            save: vi.fn().mockResolvedValue(cartProductMock),
            delete: vi.fn().mockResolvedValue(ReturnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  it('instance class ReturnCartProductDTO', () => {
    const obj = new ReturnCartProductDTO(cartProductMock);

    expect(obj.amount).toEqual(cartProductMock.amount);
  });

  it('should return Delete Result after delete product', async () => {
    const deleteResult = await service.deleteProductCart(productMock.id, cartMock.id);

    expect(deleteResult).toEqual(ReturnDeleteMock);
  });

  it('should return error in exception delete', async () => {
    vi.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error());

    expect(service.deleteProductCart(productMock.id, cartMock.id)).rejects.toThrowError();
  });

  it('should return error in exception delete', async () => {
    vi.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

    expect(service.createProductInCart(insertCartMock, cartMock.id)).rejects.toThrowError();
  });

  it('should return CartProduct if exist', async () => {
    const productCart = await service.verifyProductInCart(productMock.id, cartMock.id);

    expect(productCart).toEqual(cartProductMock);
  });

  it('should return error if not found', async () => {
    vi.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.verifyProductInCart(productMock.id, cartMock.id)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return error in exception verifyProductInCart', async () => {
    vi.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.verifyProductInCart(productMock.id, cartMock.id)).rejects.toThrowError(Error);
  });

  it('should return error in exception verifyProductInCart', async () => {
    vi.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.verifyProductInCart(productMock.id, cartMock.id)).rejects.toThrowError(Error);
  });

  it('should return error in exception insertProductInCart', async () => {
    vi.spyOn(productService, 'findProductById').mockRejectedValue(new NotFoundException());

    expect(service.insertProductInCart(insertCartMock, cartMock)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return cart product if not exist cart', async () => {
    const spy = vi.spyOn(cartProductRepository, 'save');
    vi.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    const cartProduct = await service.insertProductInCart(insertCartMock, cartMock);

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(insertCartMock.amount);
  });

  it('should return cart product if not exist cart', async () => {
    const spy = vi.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(insertCartMock, cartMock);

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductMock,
      amount: cartProductMock.amount + insertCartMock.amount,
    });
  });

  it('should return error in exception updateProductInCart', async () => {
    vi.spyOn(productService, 'findProductById').mockRejectedValue(new NotFoundException());

    expect(service.updateProductInCart(updateCartMock, cartMock)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return cart product if not exist cart (updateProductInCart)', async () => {
    vi.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.updateProductInCart(updateCartMock, cartMock)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should return cart product if not exist cart (updateProductInCart)', async () => {
    const spy = vi.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductInCart(updateCartMock, cartMock);

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateCartMock.amount);
  });
});
