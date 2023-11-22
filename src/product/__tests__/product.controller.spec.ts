import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../model/product.entity';
import { productMock } from '../__mocks__/product.mock';
import { Repository } from 'typeorm';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: vi.fn().mockResolvedValue([productMock]),
            save: vi.fn().mockResolvedValue(productMock),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
