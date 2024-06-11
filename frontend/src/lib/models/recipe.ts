export interface Recipe {
	name: string;
	priority: number;
	ingredients: IngredientWithAmount[];
}

export interface IngredientWithAmount {
	ingredient: string;
	amount: number;
}
