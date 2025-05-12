import { makeObservable, observable, action } from 'mobx';

export class BaseStore<T = any> {
  data: T | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      data: observable,
      loading: observable,
      error: observable,
      setData: action,
      setLoading: action,
      setError: action,
      reset: action,
    });
  }

  setData(data: T) {
    this.data = data;
    this.error = null;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string) {
    this.error = error;
  }

  reset() {
    this.data = null;
    this.loading = false;
    this.error = null;
  }
}
