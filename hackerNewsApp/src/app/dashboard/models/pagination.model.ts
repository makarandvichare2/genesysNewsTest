export class Pagination {
  constructor(public pageSize: number = 10, public currentPage: number = 0) {
  }

  reset() {
    this.pageSize = 10;
    this.currentPage = 0;
  }
}
