export type ObservableActionType = "Update" | "Delete";
export type ObservableAction<T> = (
  action: ObservableActionType,
  subject: T,
) => void;

export interface IObservable<T> {
  on: (subject: T, subscriber: ObservableAction<T>) => void;
  off: (subject: T, subscriber: ObservableAction<T>) => void;
}

export abstract class Observable<T> implements IObservable<T> {
  private observables: {
    [id: string]: ObservableAction<T>[];
  } = {};

  protected abstract getId(subject: T): string;

  on(subject: T, subscriber: ObservableAction<T>) {
    const id = this.getId(subject);
    let observable = this.observables[id];
    if (!observable) {
      observable = this.observables[id] = [];
    }
    observable.push(subscriber);
  }

  off(subject: T, subscriber: ObservableAction<T>) {
    const id = this.getId(subject);
    const observable = this.observables[id];
    observable?.remove((x) => x === subscriber);
    if (observable.length === 0) {
      delete this.observables[id];
    }
  }

  public emit(action: ObservableActionType, subject: T) {
    switch (action) {
      case "Update":
        this.update(subject);
        break;
      case "Delete":
        this.delete(subject);
        break;
    }
  }

  private update(subject: T) {
    const id = this.getId(subject);
    const observable = this.observables[id];
    observable?.forEach((subscriber) => {
      subscriber?.apply(subscriber, ["Update", subject]);
    });
  }

  private delete(subject: T) {
    const id = this.getId(subject);
    const observable = this.observables[id];
    observable?.forEach((subscriber) => {
      subscriber?.apply(subscriber, ["Delete", subject]);
    });
    delete this.observables[id];
  }
}
