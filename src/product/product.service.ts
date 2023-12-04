import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './model/product.entity';
import { DeleteResult, ILike, In, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-procut.dto';
import { Pagination, PaginationMeta } from '../dtos/pagination.dto';
import { ReturnProduct } from './dtos/return-product.dto';

const NUM_PAGE = 10;
const FIRST_PAGE = 1;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async findAllPage(
    search?: string,
    size = NUM_PAGE,
    page = FIRST_PAGE,
  ): Promise<Pagination<ReturnProduct[]>> {
    const skip = (page - 1) * size;
    let findOptions = {};

    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`),
        },
        take: size,
        skip,
        relations: {
          category: true,
        },
      };
    }

    const [products, total] = await this.productRepository.findAndCount({
      ...findOptions,
      take: size,
      skip,
      relations: {
        category: true,
      },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    const Meta = new PaginationMeta(Number(size), total, Number(page), Math.ceil(total / size));
    const productsList = products.map((product) => new ReturnProduct(product));

    return new Pagination(Meta, productsList);
  }

  async findAll(productId?: number[], isFindRelation: boolean = false): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelation) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }
  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
    });
  }

  async findProductById(productId: number, isRelations?: boolean): Promise<ProductEntity> {
    const relations = isRelations ? { category: true } : undefined;
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations,
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(updateProduct: UpdateProductDTO, productId: number): Promise<ProductEntity> {
    const product = await this.findProductById(productId);
    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async countProductByCategoryId(): Promise<any> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }
}
