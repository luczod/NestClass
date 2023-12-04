import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { UpdateProductDTO } from './dtos/update-procut.dto';

@Roles(UserType.Root, UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ReturnProduct[]> {
    return (await this.productService.findAll([], true)).map(
      (product) => new ReturnProduct(product),
    );
  }

  @Get('/page')
  async findAllPage(@Query('search') search: string): Promise<ReturnProduct[]> {
    return (await this.productService.findAllPage(search)).map(
      (product) => new ReturnProduct(product),
    );
  }

  @Get('/:productId')
  async findProductById(@Param('productId') productId: number): Promise<ReturnProduct> {
    return new ReturnProduct(await this.productService.findProductById(productId, true));
  }

  @Roles(UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(@Body() createProduct: CreateProductDTO): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Root, UserType.Admin)
  @Delete('/:id')
  async deleteProduct(@Param('id') productId: number): Promise<DeleteResult> {
    console.log(productId);

    return this.productService.deleteProduct(productId);
  }

  @Roles(UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct(
    @Body() updateProduct: UpdateProductDTO,
    @Param('productId') productId: number,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }
}
