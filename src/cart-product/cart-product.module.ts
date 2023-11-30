import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductEntity } from './model/cart-product.entity';
import { CartProductService } from './cart-product.service';
import { CartEntity } from '../cart/model/cart.entity';
import { ProductEntity } from '../product/model/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartProductEntity, CartEntity, ProductEntity])],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
