import { Queue } from "../game/interfaces/queue.interface";
import { Pair } from "../game/types/pair.type";

type queueItem = {
	client: string;
	userId: number;
};

export class GameQueue implements Queue<queueItem> {
	private _queue: queueItem[] = [];

	constructor(private capacity: number = Infinity) {}

	enqueue(queueItem: queueItem): void {
		if (this.size() === this.capacity) {
			throw Error("Queue has reached max capacity.");
		}
		this._queue.push(queueItem);
	}

	dequeue(): queueItem {
		return this._queue.shift();
	}

	dequeueUser(userId: number): number {
		this._queue = this._queue.filter((value) => value.userId !== userId);
		return userId;
	}

	size(): number {
		return this._queue.length;
	}

	alreadyQueued(userId: number): boolean {
		for (let user of this._queue) {
			if (user.userId === userId) return true;
		}
		return false;
	}

	getPair(): Pair<queueItem> {
		let pair: Pair<queueItem> = {
			first: this.dequeue(),
			second: this.dequeue(),
		};
		return pair;
	}
}
