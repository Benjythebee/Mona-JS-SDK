type Callback<T = void> = (data: T) => void;

export class Observer<T = void> {
    uuid: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    constructor(
        private observable: Observable<T>,
        private callback: Callback<T>
    ) {}

    // Removes this observer from the observable
    remove(): void {
        this.observable.removeObserver(this);
    }

    // Internal method to trigger the callback
    notify(data: T): void {
        this.callback(data);
    }
}

export class Observable<T = void> {
    private observers: Observer<T>[] = [];

    // Adds a callback and returns the corresponding observer instance
    add(callback: Callback<T>): Observer<T> {
        const observer = new Observer(this, callback);
        this.observers.push(observer);
        return observer;
    }

    // Notifies all observers with the given data
    notifyObservers(data: T): void {
        for (const observer of this.observers) {
            observer.notify(data);
        }
    }

    // Removes a specific observer
    removeObserver(observer: Observer<T>): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
}