import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategory } from './dtos/return-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategory(category),
    );
  }
}
