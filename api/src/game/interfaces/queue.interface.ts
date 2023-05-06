export interface Queue<T> {
	enqueue(id: T): void;
	dequeue(): T | undefined;
	size(): number;
}
