export class PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPage: number;

  constructor(itemsPerPage: number, totalItems: number, currentPage: number, totalPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.totalPage = totalPage;
  }
}

export class Pagination<T> {
  meta: PaginationMeta;
  data: T;

  constructor(paginationMeta: PaginationMeta, data: T) {
    this.meta = paginationMeta;
    this.data = data;
  }
}
