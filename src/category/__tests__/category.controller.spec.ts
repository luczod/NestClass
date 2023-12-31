import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { updateCategoryMock } from '../__mocks__/update-category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: vi.fn().mockResolvedValue([categoryMock]),
            createCategory: vi.fn().mockResolvedValue(categoryMock),
            deleteCategory: vi.fn().mockResolvedValue(ReturnDeleteMock),
            editCategory: vi.fn().mockResolvedValue(categoryMock),
            findCategoryById: vi.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return category Entity in findAllCategories', async () => {
    const category = await controller.findAllCategories();

    expect(category).toEqual([categoryMock]);
  });

  it('should return category Entity in createCategory', async () => {
    const category = await controller.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return DeleteResult in delete category', async () => {
    const category = await controller.deleteCategory(categoryMock.id);

    expect(category).toEqual(ReturnDeleteMock);
  });

  it('should send category id to delete category', async () => {
    const spy = vi.spyOn(categoryService, 'deleteCategory');
    await controller.deleteCategory(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual(categoryMock.id);
  });

  it('should return category in update category', async () => {
    const category = await controller.editCategory(categoryMock.id, updateCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should send category id and body', async () => {
    const spy = vi.spyOn(categoryService, 'editCategory');
    await controller.editCategory(categoryMock.id, updateCategoryMock);

    expect(spy.mock.calls[0][0]).toEqual(categoryMock.id);
    expect(spy.mock.calls[0][1]).toEqual(updateCategoryMock);
  });

  it('should return category in find category by id', async () => {
    const category = await controller.findCategoryById(categoryMock.id);

    expect(category).toEqual({
      id: categoryMock.id,
      name: categoryMock.name,
    });
  });

  it('should send id and true relations to findCategoryById', async () => {
    const spy = vi.spyOn(categoryService, 'findCategoryById');
    await controller.findCategoryById(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual(categoryMock.id);
    expect(spy.mock.calls[0][1]).toEqual(true);
  });
});
