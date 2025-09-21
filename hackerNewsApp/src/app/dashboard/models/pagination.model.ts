export class Pagination {
  constructor(public pageSize = 10, public currentPage = 0) {
  }

  reset() {
    this.pageSize = 10;
    this.currentPage = 0;
  }
}
