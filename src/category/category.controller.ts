import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategory } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { CreateCategory } from './dtos/create-Category.dto';
import { CategoryEntity } from './model/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategory(category),
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }
}
