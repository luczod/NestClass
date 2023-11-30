import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProductService } from '../cart-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductEntity } from '../model/cart-product.entity';
import { ProductService } from '../../product/product.service';
import { Repository } from 'typeorm';

describe('CartProductService', () => {
  let service: CartProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: ProductService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
