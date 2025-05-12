// src/stores/inventoryStore.ts
import { makeAutoObservable } from 'mobx';
import axios from '../api/axios';

export interface InventoryItem {
  id: number;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

class InventoryStore {
  items: InventoryItem[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetch() {
    this.loading = true;
    try {
      const res = await axios.get('/inventory');
      this.items = res.data;
      this.error = null;
    } catch (e: any) {
      this.error = e?.response?.data?.message || 'Ошибка загрузки';
    } finally {
      this.loading = false;
    }
  }

  async delete(id: number) {
    await axios.delete(`/inventory/${id}`);
    this.items = this.items.filter((i) => i.id !== id);
  }

  async create(data: Omit<InventoryItem, 'id' | 'createdAt'>) {
    const res = await axios.post('/inventory', data);
    this.items.push(res.data);
  }

  async update(id: number, data: Partial<InventoryItem>) {
    const res = await axios.put(`/inventory/${id}`, data);
    this.items = this.items.map((item) => (item.id === id ? res.data : item));
  }
}

export const inventoryStore = new InventoryStore();
