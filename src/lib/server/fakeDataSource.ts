import type { Database } from '$lib/models/database';
import type { DataSource, Named } from './types';

export class FakeDataSource<T extends Named<K>, K extends string = 'name'>
	implements DataSource<T, K>
{
	getAll(): Promise<Database<T>> {
		return Promise.resolve({});
	}
	get(_id: string): Promise<T> {
		return Promise.resolve({}) as unknown as Promise<T>;
	}
	post(_data: T): Promise<void> {
		throw new Error('Method not implemented.');
	}
	put(_key: string, _data: T): Promise<void> {
		throw new Error('Method not implemented.');
	}
	delete(_key: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	putMany(_data: Database<T>): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getKeyFromData(_data: T): string {
		throw new Error('Method not implemented.');
	}
}
