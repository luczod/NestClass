import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../model/order.entity';

export class ReturnOrderDTO {
  id: number;
  date: string;
  user?: ReturnUserDto;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
  }
}
