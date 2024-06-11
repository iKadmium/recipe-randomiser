import { PUBLIC_API_ROOT } from '$env/static/public';
import type { Database } from './models/database';

export class DataSource<T> {
	private endpoint: string;

	public constructor(endpoint: string) {
		this.endpoint = `${PUBLIC_API_ROOT}/${endpoint}`;
	}

	public async getAll(fetch: typeof window.fetch): Promise<Database<T>> {
		const req = await fetch(this.endpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const body = (await req.json()) as Database<T>;
		return body;
	}

	public async get(id: string, fetch: typeof window.fetch) {
		const req = await fetch(`${this.endpoint}/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const body = (await req.json()) as T;
		return body;
	}

	public async post(data: T): Promise<void> {
		const req = await fetch(this.endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (!req.ok) {
			throw new Error('Failed to save data');
		}
	}

	public async put(key: string, data: T) {
		const req = await fetch(`${this.endpoint}/${key}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if (!req.ok) {
			throw new Error('Failed to save data');
		}
	}

	public async delete(key: string) {
		const req = await fetch(`${this.endpoint}/${key}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!req.ok) {
			throw new Error('Failed to save data');
		}
	}
}
