import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartService } from '../cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartEntity } from '../model/cart.entity';
import { Repository } from 'typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
