import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductEntity } from './model/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartProductEntity])],
})
export class CartProductModule {}
