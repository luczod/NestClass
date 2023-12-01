import { PaymentPixEntity } from '../model/payment-pix.entity';
import { paymentMock } from './payment.mock';

export const paymentPixMock: PaymentPixEntity = {
  ...paymentMock,
  code: 'fdsafdsa',
  datePayment: new Date('2020-01-01'),
};
