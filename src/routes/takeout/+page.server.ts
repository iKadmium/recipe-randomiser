import { takeoutDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const takeouts = await takeoutDataSource.getAll();
	return { takeouts };
};
