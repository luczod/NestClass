import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productMock } from '../__mocks__/product.mock';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: vi.fn().mockResolvedValue([productMock]),
            createProduct: vi.fn().mockResolvedValue(productMock),
            updateProduct: vi.fn().mockResolvedValue(productMock),
            deleteProduct: vi.fn().mockResolvedValue(ReturnDeleteMock),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return returnProduct in findAll', async () => {
    const products = await controller.findAll();

    expect(products).toEqual([
      {
        id: productMock.id,
        name: productMock.name,
        price: productMock.price,
        image: productMock.image,
      },
    ]);
  });

  it('should return productEntity in createProduct', async () => {
    const product = await controller.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('should return returnDelete in deleteProduct', async () => {
    const product = await controller.deleteProduct(productMock.id);

    expect(product).toEqual(ReturnDeleteMock);
  });

  it('should return ProductEntity in updateProduct', async () => {
    const product = await controller.updateProduct(updateProductMock, productMock.id);

    expect(product).toEqual(productMock);
  });
});
