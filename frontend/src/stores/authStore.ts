import { BaseStore } from './BaseStore';
import axios from '../api/axios';
import { makeObservable, observable, action } from 'mobx';

class AuthStore extends BaseStore {
  isAuthenticated = false;

  constructor() {
    super();
    makeObservable(this, {
      isAuthenticated: observable,
      login: action.bound,
      register: action.bound,
      logout: action.bound,
      checkAuth: action.bound,
    });
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      this.isAuthenticated = true;
      this.setError(null);
    } catch (e: any) {
      this.setError(e?.response?.data?.message || 'Ошибка входа');
    } finally {
      this.setLoading(false);
    }
  }

  async register(email: string, password: string) {
    this.setLoading(true);
    try {
      await axios.post('/auth/register', { email, password });
      this.setError(null);
    } catch (e: any) {
      this.setError(e?.response?.data?.message || 'Ошибка регистрации');
    } finally {
      this.setLoading(false);
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isAuthenticated = false;
    this.reset();
  }

  checkAuth() {
    const token = localStorage.getItem('access_token');
    this.isAuthenticated = !!token;
  }
}

export const authStore = new AuthStore();
