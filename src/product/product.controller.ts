import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { ProductService } from './product.service';
import { ReturnProduct } from './dtos/return-product.dto';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductEntity } from './model/product.entity';
import { DeleteResult } from 'typeorm';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ReturnProduct[]> {
    return (await this.productService.findAll()).map((product) => new ReturnProduct(product));
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(@Body() createProduct: CreateProductDTO): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin)
  @Delete('/:id')
  async deleteProduct(@Param('id') productId: number): Promise<DeleteResult> {
    console.log(productId);

    return this.productService.deleteProduct(productId);
  }
}
