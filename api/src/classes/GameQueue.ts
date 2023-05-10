import { Queue } from "../game/interfaces/queue.interface";
import { Pair } from "../game/types/pair.type";

export class GameQueue implements Queue<number> {
	private _queue: number[] = [];

	constructor(private capacity: number = Infinity) {}

	enqueue(userId: number): void {
		if (this.size() === this.capacity) {
			throw Error("Queue has reached max capacity.");
		}
		this._queue.push(userId);
	}

	dequeue(): number {
		return this._queue.shift();
	}

	dequeueUser(userId: number): number {
		this._queue = this._queue.filter((value) => value !== userId);
		return userId;
	}

	size(): number {
		return this._queue.length;
	}

	alreadyQueued(userId: number): boolean {
		return this._queue.includes(userId);
	}

	getPair(): Pair<number> {
		let pair: Pair<number> = {
			first: 0,
			second: 0,
		};
		pair.first = this.dequeue();
		pair.second = this.dequeue();
		return pair;
	}
}
