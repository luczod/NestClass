import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryService } from '../category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../model/category.entity';
import { categoryMock } from '../__mocks__/category.mock';
import { Repository } from 'typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list category', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([categoryMock]);
  });

  it('should return error in list category empty', async () => {
    vi.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error in list category exception', async () => {
    vi.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCategories()).rejects.toThrowError();
  });
});
