import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderMock } from '../__mocks__/order.mock';
import { userEntityMock } from 'src/user/__mocks__/user.mock';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: vi.fn().mockResolvedValue(orderMock),
            findOrdersByUserId: vi.fn().mockResolvedValue([orderMock]),
          },
        },
      ],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(orderService).toBeDefined();
  });

  it('should return orders in findOrdersByUserId', async () => {
    const orders = await controller.findOrdersByUserId(userEntityMock.id);

    expect(orders).toEqual([orderMock]);
  });
});
