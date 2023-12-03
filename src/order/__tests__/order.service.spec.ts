import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderService } from '../order.service';
import { orderMock } from '../__mocks__/order.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { orderProductMock } from '../../order-product/__mocks__/order-product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';
import { createOrderPixMock } from '../__mocks__/create-order.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { OrderEntity } from '../model/order.entity';
import { PaymentService } from '../../payment/payment.service';
import { CartService } from '../../cart/cart.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { ProductService } from '../../product/product.service';
import { groupOrderMock } from '../../order-product/__mocks__/group-order.mock';

vi.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('OrderService', () => {
  let service: OrderService;
  let orderRepositoty: Repository<OrderEntity>;
  let paymentService: PaymentService;
  let cartService: CartService;
  let orderProductService: OrderProductService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PaymentService,
          useValue: {
            createPayment: vi.fn().mockResolvedValue(paymentMock),
          },
        },
        {
          provide: CartService,
          useValue: {
            findCartByUserId: vi.fn().mockResolvedValue({
              ...cartMock,
              cartProduct: [cartProductMock],
            }),
            clearCart: vi.fn(),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: vi.fn().mockResolvedValue(orderProductMock),
            findAmountProductsByOrderId: vi.fn().mockResolvedValue(groupOrderMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findAll: vi.fn().mockResolvedValue([productMock]),
          },
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            find: vi.fn().mockResolvedValue([orderMock]),
            save: vi.fn().mockResolvedValue(orderMock),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    paymentService = module.get<PaymentService>(PaymentService);
    cartService = module.get<CartService>(CartService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    productService = module.get<ProductService>(ProductService);
    orderRepositoty = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepositoty).toBeDefined();
    expect(cartService).toBeDefined();
    expect(paymentService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return orders in findOrdersByUserId', async () => {
    const spy = vi.spyOn(orderRepositoty, 'find');
    const orders = await service.findOrdersByUserId(userEntityMock.id);

    expect(orders).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: undefined,
        userId: userEntityMock.id,
      },
      relations: {
        address: {
          city: {
            state: true,
          },
        },
        ordersProduct: {
          product: true,
        },
        user: false,
        payment: {
          paymentStatus: true,
        },
      },
    });
  });

  it('should return NotFoundException in find return empty', async () => {
    vi.spyOn(orderRepositoty, 'find').mockResolvedValue([]);

    expect(service.findOrdersByUserId(userEntityMock.id)).rejects.toThrowError(NotFoundException);
  });

  it('should call createOrderProduct amount cartProduct in cart', async () => {
    const spyOrderProduct = vi.spyOn(orderProductService, 'createOrderProduct');

    const createOrderProductUsingCart = await service.createOrderProductUsingCart(
      {
        ...cartMock,
        cartProduct: [cartProductMock, cartProductMock],
      },
      orderMock.id,
      [productMock],
    );

    expect(createOrderProductUsingCart).toEqual([orderProductMock, orderProductMock]);
    expect(spyOrderProduct.mock.calls.length).toEqual(2);
  });

  it('should return order in saveOrder', async () => {
    const spy = vi.spyOn(orderRepositoty, 'save');

    const order = await service.saveOrder(createOrderPixMock, userEntityMock.id, paymentMock);

    expect(order).toEqual(orderMock);
    expect(spy.mock.calls[0][0]).toEqual({
      addressId: createOrderPixMock.addressId,
      date: new Date(),
      paymentId: paymentMock.id,
      userId: userEntityMock.id,
    });
  });

  it('should expection in error save', async () => {
    vi.spyOn(orderRepositoty, 'save').mockRejectedValue(new Error());

    expect(
      service.saveOrder(createOrderPixMock, userEntityMock.id, paymentMock),
    ).rejects.toThrowError();
  });

  it('should return order in create order success', async () => {
    const spyCartService = vi.spyOn(cartService, 'findCartByUserId');
    const spyProductService = vi.spyOn(productService, 'findAll');
    const spyCartServiceClear = vi.spyOn(cartService, 'clearCart');
    const spyOrderProductService = vi.spyOn(orderProductService, 'createOrderProduct');
    const spyPaymentService = vi.spyOn(paymentService, 'createPayment');
    const spySave = vi.spyOn(orderRepositoty, 'save');

    const order = await service.createOrder(createOrderPixMock, userEntityMock.id);

    expect(order).toEqual(orderMock);
    expect(spyCartService.mock.calls.length).toEqual(1);
    expect(spyProductService.mock.calls.length).toEqual(1);
    expect(spyPaymentService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(1);
    expect(spyOrderProductService.mock.calls.length).toEqual(1);
    expect(spyCartServiceClear.mock.calls.length).toEqual(1);
  });

  it.skip('should return orders', async () => {
    const spy = vi.spyOn(orderRepositoty, 'find');
    const orders = await service.findAllOrders();

    expect(orders).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        user: true,
      },
    });
  });

  it('should error in not found', async () => {
    vi.spyOn(orderRepositoty, 'find').mockResolvedValue([]);

    expect(service.findAllOrders()).rejects.toThrowError(new NotFoundException('Orders not found'));
  });
});
