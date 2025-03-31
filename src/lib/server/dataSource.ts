import { PUBLIC_DATA_ROOT } from '$env/static/public';
import { readFile, writeFile } from 'node:fs/promises';
import type { Database } from '../models/database';

export interface Named {
	name: string;
}

export class DataSource<T extends Named> {
	private filename: string;

	public constructor(filename: string) {
		this.filename = `${PUBLIC_DATA_ROOT}/${filename}`;
	}

	public async getAll(): Promise<Database<T>> {
		try {
			const contents = await readFile(this.filename, { encoding: 'utf-8' });

			if (!contents) {
				throw new Error('Failed to read file');
			}

			const data = JSON.parse(contents) as Database<T>;
			return data;
		} catch (error) {
			console.error('Error reading file:', error);
			return {};
		}
	}

	public async get(id: string) {
		const all = await this.getAll();
		if (id in all) {
			return all[id];
		}
		throw new Error(`No data found for id: ${id}`);
	}

	public async post(data: T): Promise<void> {
		try {
			const all = await this.getAll();

			const id = data.name;
			all[id] = data;

			await writeFile(this.filename, JSON.stringify(all, null, 2));
		} catch (error) {
			console.error('Error writing file:', error);
			throw new Error('Failed to save data');
		}
	}

	public async put(key: string, data: T) {
		const all = await this.getAll();
		if (key in all) {
			all[key] = data;
			await writeFile(this.filename, JSON.stringify(all, null, 2));
		} else {
			throw new Error(`No data found for id: ${key}`);
		}
	}

	public async delete(key: string) {
		const all = await this.getAll();
		if (key in all) {
			delete all[key];
			await writeFile(this.filename, JSON.stringify(all, null, 2));
		}
	}
}
