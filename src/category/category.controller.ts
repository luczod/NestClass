import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategory } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { CreateCategory } from './dtos/create-Category.dto';
import { CategoryEntity } from './model/category.entity';
import { DeleteResult } from 'typeorm';
import { UpdateCategory } from './dtos/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return this.categoryService.findAllCategories();
  }

  @Get('/:categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number): Promise<ReturnCategory> {
    return new ReturnCategory(await this.categoryService.findCategoryById(categoryId, true));
  }

  @Roles(UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put('/:categoryId')
  async editCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategory: UpdateCategory,
  ): Promise<CategoryEntity> {
    return this.categoryService.editCategory(categoryId, updateCategory);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete('/:categoryId')
  async deleteCategory(@Param('categoryId') categoryId: number): Promise<DeleteResult> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
