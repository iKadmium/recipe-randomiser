import { RUNTIME_ENVIRONMENT } from '$env/static/private';
import { NetlifyBlobsDataSource } from './netlifyBlobsDataSource';
import { NodeFSDataSource } from './nodeFSDataSource';
import type { DataSource, DataSourceProvider, Named } from './types';

/**
 * Factory function to create a DataSource implementation based on environment
 * @param filename The filename for the data store
 * @param keyProperty The property name to use as the key (defaults to 'name')
 * @param useNetlifyBlobs Whether to use Netlify Blobs (default: false for Node.js filesystem)
 * @returns A DataSource implementation
 */
export function createDataSource<T extends Named<K>, K extends string = 'name'>(
	filename: string,
	keyProperty: K = 'name' as K,
	provider?: DataSourceProvider
): DataSource<T, K> {
	const dataSourceProvider: DataSourceProvider =
		provider || (RUNTIME_ENVIRONMENT === 'netlify' ? 'netlifyblobs' : 'nodefs');

	switch (dataSourceProvider) {
		case 'netlifyblobs':
			return new NetlifyBlobsDataSource<T, K>(filename, keyProperty);
		default:
		case 'nodefs':
			return new NodeFSDataSource<T, K>(filename, keyProperty);
	}
}
