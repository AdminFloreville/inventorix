// src/stores/historyStore.ts
import { makeAutoObservable } from 'mobx';
import axios from '../api/axios';

export interface HistoryRecord {
  id: number;
  action: 'create' | 'update' | 'delete';
  entity: string;
  entityId: number;
  payload: any;
  timestamp: string;
}

class HistoryStore {
  items: HistoryRecord[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetch() {
    this.loading = true;
    try {
      const res = await axios.get('/history');
      this.items = res.data;
      this.error = null;
    } catch (e: any) {
      this.error = e?.response?.data?.message || 'Ошибка загрузки истории';
    } finally {
      this.loading = false;
    }
  }

  get sorted() {
    return [...this.items].sort((a, b) => b.id - a.id);
  }

  filterByAction(action: string | null) {
    return action ? this.sorted.filter((i) => i.action === action) : this.sorted;
  }
}

export const historyStore = new HistoryStore();
