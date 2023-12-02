import { ReturnAddressDto } from '../../address/dtos/returnAdress.dto';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../model/order.entity';
import { ReturnPaymentDTO } from '../../payment/dtos/return-payment.dto';
import { ReturnOrderProductDTO } from '../../order-product/dtos/return-order-product.dto';

export class ReturnOrderDTO {
  id: number;
  date: string;
  userId: number;
  addressId: number;
  paymentId: number;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDTO;
  ordersProduct?: ReturnOrderProductDTO[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.userId = order.userId;
    this.addressId = order.addressId;
    this.paymentId = order.paymentId;
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address ? new ReturnAddressDto(order.address) : undefined;
    this.payment = order.payment ? new ReturnPaymentDTO(order.payment) : undefined;
    this.ordersProduct = order.ordersProduct
      ? order.ordersProduct.map((orderProduct) => new ReturnOrderProductDTO(orderProduct))
      : undefined;
  }
}