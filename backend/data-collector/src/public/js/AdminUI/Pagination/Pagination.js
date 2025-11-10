// Pagination.js
class Pagination {
  constructor({
    items = [],
    pageSize = 50,
    currentPage = 1,
    onChange = null,
    reverseItems = false,
  } = {}) {
    this.items = items;
    this.pageSize = Math.max(1, pageSize);
    this.currentPage = Math.max(1, Number(currentPage) || 1);
    this.onChange = onChange;

    this.reverseItems = reverseItems;

    this._clampPage();
    this._emitChange();
  }

  setItems(items = []) {
    this.items = items;
    this._clampPage();
    this._emitChange();
  }

  setPageSize(pageSize = 50) {
    this.pageSize = Math.max(1, pageSize);
    this._clampPage();
    this._emitChange();
  }

  get totalItems() {
    return this.items.length;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get hasPrev() {
    return this.currentPage > 1;
  }

  get hasNext() {
    return this.currentPage < this.totalPages;
  }

  goTo(page) {
    const target = this._normalizePage(page);
    if (target === this.currentPage) return this.getState();
    this.currentPage = target;
    this._emitChange();
    return this.getState();
  }

  next() {
    return this.goTo(this.currentPage + 1);
  }

  prev() {
    return this.goTo(this.currentPage - 1);
  }

  getPageItems(page = this.currentPage, reverse = this.reverseItems) {
    const p = this._normalizePage(page);
    const start = (p - 1) * this.pageSize;
    const end = start + this.pageSize;

    const items = !reverse ? this.items : [...this.items].reverse();
    return items.slice(start, end);
  }

  getState() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      pageSize: this.pageSize,
      totalItems: this.totalItems,
      items: this.getPageItems(),
    };
  }

  _clampPage() {
    this.currentPage = this._normalizePage(this.currentPage);
  }

  _emitChange() {
    if (this.onChange) this.onChange(this.getState());
  }

  _normalizePage(page) {
    return Math.max(1, Math.min(this.totalPages, page));
  }
}

export { Pagination };
