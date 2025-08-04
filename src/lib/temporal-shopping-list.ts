import { Temporal } from '@js-temporal/polyfill';
import type { MealDate } from './temporal-meal-generator';
import type { Database } from './models/database';
import type { Ingredient } from './models/ingredient';
import type { IngredientWithAmount, Recipe } from './models/recipe';

export interface ShoppingList {
    fresh: {
        week: number;
        ingredients: IngredientWithAmount[];
    }[];
    pantry: IngredientWithAmount[];
}

function addIngredient(ingredient: IngredientWithAmount, list: IngredientWithAmount[]): void {
    const existingIngredient = list.find((item) => item.ingredient === ingredient.ingredient);
    if (existingIngredient) {
        existingIngredient.amount += ingredient.amount;
    } else {
        list.push({ ...ingredient });
    }
}

function getWeekNumber(date: Temporal.PlainDate, startDate: Temporal.PlainDate): number {
    const daysSinceStart = date.since(startDate).total('days');
    const startDayOfWeek = startDate.dayOfWeek === 7 ? 0 : startDate.dayOfWeek; // Convert Sunday=7 to Sunday=0
    const adjustedDays = daysSinceStart + startDayOfWeek;
    return Math.floor(adjustedDays / 7);
}

export function getShoppingList(
    mealDays: MealDate[],
    recipes: Database<Recipe>,
    ingredients: Database<Ingredient>
): ShoppingList {
    const shoppingList: ShoppingList = {
        fresh: [],
        pantry: []
    };

    const recipeNames = mealDays.map((meal) => meal.meal);

    for (const recipeName of recipeNames) {
        if (!recipeName) continue; // Skip if meal is undefined or empty
        const recipe = recipes[recipeName];
        if (!recipe) continue;

        for (const ingredient of recipe.ingredients) {
            const ingredientData = ingredients[ingredient.ingredient];
            if (!ingredientData) continue;

            if (ingredientData.fresh) {
                const daysWithIngredient = mealDays
                    .filter((meal) => meal.meal === recipeName)
                    .map((meal) => meal.date);
                for (const day of daysWithIngredient) {
                    const week = getWeekNumber(day, mealDays[0].date);
                    let weekEntry = shoppingList.fresh.find((entry) => entry.week === week);

                    if (!weekEntry) {
                        weekEntry = { week, ingredients: [] };
                        shoppingList.fresh.push(weekEntry);
                    }

                    addIngredient(ingredient, weekEntry.ingredients);
                }
            } else {
                addIngredient(ingredient, shoppingList.pantry);
            }
        }
    }

    return shoppingList;
}
