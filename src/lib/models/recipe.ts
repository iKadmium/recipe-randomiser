export interface Recipe {
	name: string;
	priority: number;
	ingredients: IngredientWithAmount[];
	difficulty: number;
	tags: string[];
	maxPerMonth?: number;
}

export interface IngredientWithAmount {
	ingredient: string;
	amount: number;
}

export enum Difficulty {
	Easy = 1,
	Medium,
	Hard
}
