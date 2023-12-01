import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './model/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntity: Repository<OrderEntity>,
  ) {}

  async createOrder(createOrderDTO: CreateOrderDTO, cartId: number) {
    return null;
  }
}
