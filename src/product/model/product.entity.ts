import { OrderProductEntity } from '../../order-product/model/order-product.entity';
import { CartProductEntity } from '../../cart-product/model/cart-product.entity';
import { CategoryEntity } from '../../category/model/category.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @Column({ name: 'price', type: 'decimal', nullable: false })
  price: number;

  @Column({ name: 'image', nullable: false })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany('CartProductEntity', 'products')
  cartProduct?: CartProductEntity[];

  @ManyToOne('CategoryEntity', 'products')
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;

  @OneToMany('OrderProductEntity', 'product')
  orderProduct?: OrderProductEntity[];
}
