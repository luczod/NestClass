import { Pagination } from 'src/dtos/pagination.dto';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { ProductEntity } from '../model/product.entity';

export const productMock: ProductEntity = {
  categoryId: categoryMock.id,
  createdAt: new Date(),
  id: 7435,
  image: 'http://image.com',
  name: 'name product mock',
  price: 34,
  updatedAt: new Date(),
};

export const productPaginationMock: Pagination<ProductEntity[]> = {
  data: [productMock],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 10,
    totalPages: 1,
  },
};
