import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { UserId } from '../decorators/userid.decorator';
import { OrderEntity } from './model/order.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { ReturnOrderDTO } from './dtos/return-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @UserId() userId: number) {
    return this.orderService.createOrder(createOrderDTO, userId);
  }

  @Get()
  async findOrdersByUserId(@UserId() userId: number): Promise<OrderEntity[]> {
    return this.orderService.findOrdersByUserId(userId);
  }

  @Roles(UserType.Admin)
  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDTO[]> {
    return (await this.orderService.findAllOrders()).map((order) => new ReturnOrderDTO(order));
  }

  @Roles(UserType.Admin)
  @Get('/:orderId')
  async findOrderById(@Param('orderId') orderId: number): Promise<ReturnOrderDTO> {
    return new ReturnOrderDTO((await this.orderService.findOrdersByUserId(undefined, orderId))[0]);
  }
}
