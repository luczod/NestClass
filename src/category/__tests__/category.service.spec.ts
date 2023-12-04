import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryService } from '../category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../model/category.entity';
import { categoryMock } from '../__mocks__/category.mock';
import { Repository } from 'typeorm';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { ProductEntity } from '../../product/model/product.entity';
import { CountProductMock } from '../../product/__mocks__/count.mock';
import { ReturnCategory } from '../dtos/return-category.dto';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { BadRequestException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            findOne: vi.fn().mockResolvedValue(categoryMock),
            find: vi.fn().mockResolvedValue([categoryMock]),
            save: vi.fn().mockResolvedValue(categoryMock),
            delete: vi.fn().mockResolvedValue(ReturnDeleteMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return list category', async () => {
    vi.spyOn(service, 'countProductByCategoryId').mockResolvedValue([CountProductMock]);
    const categories = await service.findAllCategories();
    const resultList = new ReturnCategory(categoryMock, 0);

    expect(categories).toEqual([resultList]);
  });

  it('should return error in list category empty', async () => {
    vi.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error in list category exception', async () => {
    vi.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error if exist category name', async () => {
    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  it('should return category after save', async () => {
    // clear before createCategory
    vi.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return error in createCategory exception', async () => {
    vi.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  it('should return category in find by name', async () => {
    const category = await service.findCategoryByName(categoryMock.name);

    expect(category).toEqual(categoryMock);
  });

  it('should return error if category find by name empty', async () => {
    vi.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCategoryByName(categoryMock.name)).rejects.toThrowError();
  });

  it('should return category in find by id', async () => {
    const category = await service.findCategoryById(categoryMock.id);

    expect(category).toEqual(categoryMock);
  });

  it('should return error in not found category id', async () => {
    vi.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCategoryById(categoryMock.id)).rejects.toThrowError();
  });

  it('should return delete result in success', async () => {
    const deleteResult = await service.deleteCategory(categoryMock.id);

    expect(deleteResult).toEqual(ReturnDeleteMock);
  });

  it('should send relations in request findOne', async () => {
    const spy = vi.spyOn(categoryRepository, 'findOne');
    await service.deleteCategory(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: categoryMock.id,
      },
      relations: {
        products: true,
      },
    });
  });

  it('should return error if category with relations', async () => {
    vi.spyOn(categoryRepository, 'findOne').mockResolvedValue({
      ...categoryMock,
      products: productMock,
    });

    expect(service.deleteCategory(categoryMock.id)).rejects.toThrowError(BadRequestException);
  });
});
