import type { Database } from '../models/database';

export type Named<K extends string = 'name'> = {
	[P in K]: string;
};

export interface DataSource<T extends Named<K>, K extends string = 'name'> {
	getAll(): Promise<Database<T>>;
	get(id: string): Promise<T | undefined>;
	post(data: T): Promise<void>;
	put(key: string, data: T): Promise<void>;
	delete(key: string): Promise<void>;
	putMany(data: Database<T>): Promise<void>;
	getKeyFromData(data: T): string;
}

export type DataSourceProvider = 'nodefs' | 'netlifyblobs';
export type RuntimeEnvironment = 'node' | 'netlify';
