import { makeAutoObservable, runInAction } from 'mobx';
import axios from '../api/axios';

class PrinterStore {
  items: any[] = [];
  loading = false;
  page = 0;
  limit = 10;
  hasMore = true;
  searchTerm = '';

  constructor() {
    makeAutoObservable(this);
  }

  async fetch(reset = false) {
    if (this.loading || (!this.hasMore && !reset)) return;
    this.loading = true;

    try {
      const offset = reset ? 0 : this.page * this.limit;
      const res = await axios.get('/printer', {
        params: {
          search: this.searchTerm,
          limit: this.limit,
          offset,
        },
      });

      runInAction(() => {
        this.items = reset ? res.data : [...this.items, ...res.data.items];
        this.hasMore = res.data.hasMore;
        this.page = reset ? 1 : this.page + 1;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateStatus(id: number, isOnline: boolean, offlineSince?: string | null) {
    const index = this.items.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.items[index].isOnline = isOnline;
      this.items[index].offlineSince = offlineSince ?? null;
    }
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
    this.page = 0;
    this.hasMore = true;
    this.fetch(true);
  }

  async create(data: { ipAddress: string; inventoryId: number }) {
    await axios.post('/printer', data);
    this.fetch(true);
  }

  async update(id: number, data: { ipAddress: string; inventoryId: number }) {
    await axios.put(`/printer/${id}`, data);
    this.fetch(true);
  }

  async delete(id: number) {
    await axios.delete(`/printer/${id}`);
    this.fetch(true);
  }

}

export const printerStore = new PrinterStore();
