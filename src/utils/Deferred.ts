export class Deferred<T> {
  promise: Promise<T>;

  resolve: (value: T | PromiseLike<T>) => void = () => {};

  reject: (reason?: any) => void = () => {};

  cancel: (reason?: any) => void = () => {};

  notify = (result?: any) => {};

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
