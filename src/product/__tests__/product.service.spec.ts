import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductService } from '../product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../model/product.entity';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { productMock } from '../__mocks__/product.mock';
import { ILike, In, Repository } from 'typeorm';
import { createProductMock } from '../__mocks__/create-product.mock';
import { ReturnDeleteMock } from 'src/__mocks__/return-delete.mock';
import { ReturnProduct } from '../dtos/return-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: vi.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: vi.fn().mockResolvedValue([productMock]),
            findOne: vi.fn().mockResolvedValue(productMock),
            save: vi.fn().mockResolvedValue(productMock),
            delete: vi.fn().mockResolvedValue(ReturnDeleteMock),
            findAndCount: vi.fn().mockResolvedValue([[productMock], 1]),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAll();

    expect(products).toEqual([productMock]);
  });

  it('should return relations in findAll with args', async () => {
    const spy = vi.spyOn(productRepository, 'find');
    const products = await service.findAll([], true);

    expect(products).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({ relations: { category: true } });
  });

  it('should return products filterd in findAll with args productid', async () => {
    const spy = vi.spyOn(productRepository, 'find');
    const products = await service.findAll([7435], true);

    expect(products).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: { id: In([7435]) },
      relations: { category: true },
    });
  });

  it('should return error if products empty', async () => {
    vi.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return error in exception', async () => {
    vi.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrowError();
  });

  it('should return product after insert in DB', async () => {
    const product = await service.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('should return product after insert in DB', async () => {
    vi.spyOn(categoryService, 'findCategoryById').mockRejectedValue(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrowError();
  });

  it('should return product findProductById', async () => {
    const spy = vi.spyOn(productRepository, 'findOne');
    const product = await service.findProductById(productMock.id);

    expect(product).toEqual(productMock);
    expect(spy.mock.calls[0][0]).toEqual({ where: { id: productMock.id } });
  });

  it('should return product findProductById with relations', async () => {
    const spy = vi.spyOn(productRepository, 'findOne');
    const product = await service.findProductById(productMock.id, true);

    expect(product).toEqual(productMock);
    expect(spy.mock.calls[0][0]).toEqual({
      where: { id: productMock.id },
      relations: { category: true },
    });
  });

  it('should return error in findProductById not found', async () => {
    vi.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductById(productMock.id)).rejects.toThrowError();
  });

  it('should return true in deleteProduct', async () => {
    const product = await service.deleteProduct(productMock.id);

    expect(product).toEqual(ReturnDeleteMock);
  });

  it('should return produt after update', async () => {
    const product = await service.updateProduct(createProductMock, productMock.id);

    expect(product).toEqual(productMock);
  });

  it('should error in update product', async () => {
    vi.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(service.updateProduct(createProductMock, productMock.id)).rejects.toThrowError();
  });

  it('should return product pagination', async () => {
    const spy = vi.spyOn(productRepository, 'findAndCount');
    const productsPagination = await service.findAllPage();

    expect(productsPagination.data).toEqual([new ReturnProduct(productMock)]);
    expect(productsPagination.meta).toEqual({
      itemsPerPage: 10,
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
    });
    expect(spy.mock.calls[0][0]).toEqual({
      take: 10,
      skip: 0,
      relations: {
        category: true,
      },
    });
  });

  it('should return product pagination send size and page', async () => {
    const mockSize = 432;
    const mockPage = 532;
    const productsPagination = await service.findAllPage(undefined, mockSize, mockPage);

    expect(productsPagination.data).toEqual([new ReturnProduct(productMock)]);
    expect(productsPagination.meta).toEqual({
      itemsPerPage: mockSize,
      totalItems: 1,
      currentPage: mockPage,
      totalPages: 1,
    });
  });

  it('should return product pagination search', async () => {
    const mockSearch = 'mockSearch';
    const spy = vi.spyOn(productRepository, 'findAndCount');
    await service.findAllPage(mockSearch);

    expect(spy.mock.calls[0][0].where).toEqual({
      name: ILike(`%${mockSearch}%`),
    });
  });
});
