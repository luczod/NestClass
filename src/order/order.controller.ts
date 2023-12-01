import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/cart/:cartId')
  @UsePipes(ValidationPipe)
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @Param('cartId') cartId: number) {
    return this.orderService.createOrder(createOrderDTO, cartId);
  }
}
