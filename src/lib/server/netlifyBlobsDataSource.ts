import { getStore } from '@netlify/blobs';
import type { Database } from '../models/database';
import type { DataSource, Named } from './types';

export class NetlifyBlobsDataSource<T extends Named<K>, K extends string = 'name'>
	implements DataSource<T, K>
{
	private store: ReturnType<typeof getStore>;
	private key: string;
	private keyProperty: K;

	public constructor(filename: string, keyProperty: K = 'name' as K) {
		this.store = getStore({
			name: 'data',
			siteID: process.env.NETLIFY_SITE_ID,
			token: process.env.NETLIFY_BLOBS_STORE_TOKEN
		});
		this.key = filename.replace('.json', '');
		this.keyProperty = keyProperty;
	}

	public getKeyFromData(data: T): string {
		return data[this.keyProperty];
	}

	public async getAll(): Promise<Database<T>> {
		try {
			const data = await this.store.get(this.key, { type: 'text' });
			if (!data) {
				return {};
			}
			return JSON.parse(data as string) as Database<T>;
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
			const all = await this.getAll();
			const id = this.getKeyFromData(data);
			all[id] = data;
			await this.store.setJSON(this.key, all);
		} catch (error) {
			console.error('Error writing to Netlify Blobs:', error);
			throw error;
		}
	}

	public async put(key: string, data: T): Promise<void> {
		const all = await this.getAll();
		if (key in all) {
			all[key] = data;
			await this.store.setJSON(this.key, all);
		} else {
			throw new Error(`No data found for id: ${key}`);
		}
	}

	public async delete(key: string): Promise<void> {
		const all = await this.getAll();
		if (key in all) {
			delete all[key];
			await this.store.set(this.key, JSON.stringify(all));
		}
	}

	public async putMany(data: Database<T>): Promise<void> {
		try {
			const all = await this.getAll();
			for (const key in data) {
				all[key] = data[key];
			}
			await this.store.setJSON(this.key, all);
		} catch (error) {
			console.error('Error writing multiple entries to Netlify Blobs:', error);
			throw error;
		}
	}
}
