import type { Takeout } from '$lib/models/takeout';
import type { Ingredient } from '../models/ingredient';
import type { Recipe } from '../models/recipe';
import type { Tag } from '../models/tag';
import { createDataSource } from './dataSourceFactory';

// Export the interface and implementations for use in other parts of the application
export { createDataSource } from './dataSourceFactory';
export { NetlifyBlobsDataSource } from './netlifyBlobsDataSource';
export { NodeFSDataSource } from './nodeFSDataSource';
export type { DataSource, Named } from './types';

// place files you want to import through the `$lib` alias in this folder.
export const ingredientsDataSource = createDataSource<Ingredient>('ingredients.json');
export const recipesDataSource = createDataSource<Recipe>('recipes.json');
export const tagsDataSource = createDataSource<Tag>('tags.json');
export const takeoutDataSource = createDataSource<Takeout>('takeout.json');