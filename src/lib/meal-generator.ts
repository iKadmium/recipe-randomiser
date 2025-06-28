import type { Database } from './models/database';
import { Difficulty, type Recipe } from './models/recipe';
import { getRandomWithPenalty, toUTCIsoString } from './util';

export interface MealDate {
	date: Date;
	meal?: string;
}

export function generateMeals(
	startDate: Date,
	endDate: Date,
	easyMealDays: Date[],
	takeoutDays: Date[],
	recipes: Database<Recipe>
): MealDate[] {
	const meals: MealDate[] = [];
	const currentDate = new Date(startDate);

	try {
		while (currentDate <= endDate) {
			const meal = getMealForDate(currentDate, easyMealDays, takeoutDays, recipes, meals);
			meals.push({ date: new Date(currentDate), meal });
			currentDate.setDate(currentDate.getDate() + 1);
		}
	} catch (error) {
		console.error('Error generating meals:', error);
	}

	return meals;
}

export function getMealForDate(
	date: Date,
	easyMealDays: Date[],
	takeoutDays: Date[],
	recipes: Database<Recipe>,
	existingMeals: MealDate[]
): string | undefined {
	const dayOfWeek = date.getDay();
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

	const dateString = toUTCIsoString(date);
	const isEasyMealDay = easyMealDays.some(
		(easyMealDate) => toUTCIsoString(easyMealDate) === dateString
	);
	const isTakeoutDay = takeoutDays.some(
		(takeoutDate) => toUTCIsoString(takeoutDate) === dateString
	);

	const allRecipes = Object.values(recipes);
	const easyRecipes = allRecipes.filter((recipe) => recipe.difficulty === Difficulty.Easy);
	const mediumRecipes = allRecipes.filter((recipe) => recipe.difficulty === Difficulty.Medium);
	const hardRecipes = allRecipes.filter((recipe) => recipe.difficulty === Difficulty.Hard);

	let filteredRecipes: Recipe[] = [];

	if (isTakeoutDay) {
		return 'Takeout';
	}

	if (isEasyMealDay) {
		filteredRecipes = easyRecipes;
	} else if (isWeekend) {
		filteredRecipes = [...mediumRecipes, ...hardRecipes];
	} else {
		filteredRecipes = mediumRecipes;
	}

	const mealsThisWeek = existingMeals.filter((meal) => {
		const mealDate = new Date(meal.date);
		const startOfWeek = new Date(date);
		startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(endOfWeek.getDate() + 6);
		return mealDate >= startOfWeek && mealDate <= endOfWeek;
	});

	filteredRecipes = filteredRecipes.filter((recipe) => {
		const usedCount = existingMeals.filter((meal) => meal.meal === recipe.name).length;
		if (mealsThisWeek.some((meal) => meal.meal === recipe.name)) {
			return false; // Skip if the recipe has already been used this week
		}
		if (recipe.maxPerMonth && usedCount >= recipe.maxPerMonth) {
			return false; // Skip if the recipe has already been used this month
		}
		return true;
	});

	const mealRecency: Record<string, number> = {};
	existingMeals.forEach((meal) => {
		if (meal.meal) {
			const daysSince = Math.floor((date.getTime() - meal.date.getTime()) / (1000 * 60 * 60 * 24));
			if (mealRecency[meal.meal] === undefined || daysSince > mealRecency[meal.meal]) {
				mealRecency[meal.meal] = daysSince;
			}
		}
	});

	return getRandomWithPenalty(
		filteredRecipes.map((x) => x.name),
		mealRecency,
		(name: string) => name
	);
}
