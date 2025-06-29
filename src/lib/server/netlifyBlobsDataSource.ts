import { getStore, type GetWithMetadataResult } from '@netlify/blobs';
import type { Database } from '../models/database';
import type { DataSource, Named } from './types';

export class NetlifyBlobsDataSource<T extends Named<K>, K extends string = 'name'>
	implements DataSource<T, K> {
	private store: ReturnType<typeof getStore>;
	private key: string;
	private keyProperty: K;

	public constructor(filename: string, keyProperty: K = 'name' as K) {
		this.store = getStore({name: 'data'});
		this.key = filename.replace('.json', '');
		this.keyProperty = keyProperty;
	}

	public getKeyFromData(data: T): string {
		return data[this.keyProperty];
	}

	private async getDataRaw(): Promise<{ data: string } & GetWithMetadataResult | null> {
		const data = await this.store.getWithMetadata(this.key, { type: 'text', consistency: 'strong' });
		return data;
	}

	private async getAllWithMetadata(): Promise<{ data: Database<T> } & GetWithMetadataResult> {
		const data = await this.store.getWithMetadata(this.key, { type: 'text', consistency: 'strong' });
		if (!data) {
			return { data: {} as Database<T>, metadata: {} };
		}
		return { data: JSON.parse(data.data) as Database<T>, metadata: data.metadata };
	}

	public async getAll(): Promise<Database<T>> {
		try {
			const data = await this.getAllWithMetadata();
			if (!data) {
				return {};
			}
			return data.data;
		} catch (error) {
			console.error('Error reading from Netlify Blobs:', error);
			return {};
		}
	}

	public async get(id: string): Promise<T | undefined> {
		const all = await this.getAll();
		if (id in all) {
			return all[id];
		}
		return undefined;
	}

	public async post(data: T): Promise<void> {
		try {
			const all = await this.getAllWithMetadata();
			const id = this.getKeyFromData(data);
			all.data[id] = data;
			this.store.setJSON(this.key, all.data, { onlyIfMatch: all.etag });
		} catch (error) {
			console.error('Error writing to Netlify Blobs:', error);
			throw error;
		}
	}

	public async put(key: string, data: T): Promise<void> {
		const all = await this.getAllWithMetadata();
		if (key in all.data) {
			all.data[key] = data;
			await this.store.setJSON(this.key, all.data, { onlyIfMatch: all.etag });
		} else {
			throw new Error(`No data found for id: ${key}`);
		}
	}

	public async delete(key: string): Promise<void> {
		const all = await this.getAllWithMetadata();
		if (key in all.data) {
			delete all.data[key];
			await this.store.setJSON(this.key, all.data, { onlyIfMatch: all.etag });
		}
	}

	public async putMany(data: Database<T>): Promise<void> {
		try {
			const all = await this.getAllWithMetadata();
			for (const key in data) {
				all.data[key] = data[key];
			}
			await this.store.setJSON(this.key, all.data, { onlyIfMatch: all.etag });
		} catch (error) {
			console.error('Error writing multiple entries to Netlify Blobs:', error);
			throw error;
		}
	}
}
