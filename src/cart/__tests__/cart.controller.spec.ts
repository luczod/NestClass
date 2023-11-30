import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartEntity } from '../model/cart.entity';
import { CartProductService } from '../../cart-product/cart-product.service';
import { Repository } from 'typeorm';

describe('CartController', () => {
  let controller: CartController;
  let cartRepository: Repository<CartEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
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

    controller = module.get<CartController>(CartController);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
