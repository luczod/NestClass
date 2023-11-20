import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../model/category.entity';
import { categoryMock } from '../__mocks__/category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: vi.fn().mockResolvedValue([categoryMock]),
            save: vi.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
