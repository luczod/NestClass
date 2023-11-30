import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProductService } from '../cart-product.service';

describe('CartProductService', () => {
  let service: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartProductService],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
