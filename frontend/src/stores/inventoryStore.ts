import { makeAutoObservable } from 'mobx';
import axios from '../api/axios';

export interface InventoryPart {
  id: number;
  name: string;
  serialNumber: string;
  count: number;
  price: number;
  isWrittenOff: boolean;
}

export interface InventoryItem {
  parts: any;
  id: number;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  serialNumber?: string;
  count?: number;
  createdAt: string;
  subItems?: InventoryPart[]; // 👈 для вложенных частей
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

  // 🔽 Вложенные записи (части)

  async addPart(inventoryId: number, data: any) {
    await axios.post(`/inventory/${inventoryId}/parts`, data);
    await this.fetch(); // обновляем весь список
  }

  async updatePart(partId: number, data: any) {
    await axios.put(`/inventory/parts/${partId}`, data);
    await this.fetch();
  }

  async deletePart(partId: number) {
    await axios.delete(`/inventory/parts/${partId}`);
    await this.fetch();
  }
}

export const inventoryStore = new InventoryStore();
