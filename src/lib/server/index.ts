import { DataSource } from './dataSource';
import type { Ingredient } from '../models/ingredient';
import type { Recipe } from '../models/recipe';
import type { Tag } from '../models/tag';

// place files you want to import through the `$lib` alias in this folder.
export const ingredientsDataSource = new DataSource<Ingredient>('ingredients.json');
export const recipesDataSource = new DataSource<Recipe>('recipes.json');
export const tagsDataSource = new DataSource<Tag>('tags.json');
