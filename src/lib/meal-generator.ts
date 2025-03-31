import type { Database } from "./models/database";
import { Difficulty, type Recipe } from "./models/recipe";
import { getRandom } from "./util";

export interface MealDate {
    date: Date;
    meal: string;
}

export function generateMeals(startDate: Date, endDate: Date, easyMealDays: Date[], takeoutDays: Date[], recipes: Database<Recipe>): MealDate[] {
    const meals: MealDate[] = [];
    const currentDate = new Date(startDate);

    try {
        while (currentDate <= endDate) {
            const meal = getMealForDate(currentDate, easyMealDays, takeoutDays, recipes);
            meals.push({ date: new Date(currentDate), meal });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } catch (error) {
        console.error("Error generating meals:", error);
    }

    return meals;
}

export function getMealForDate(date: Date, easyMealDays: Date[], takeoutDays: Date[], recipes: Database<Recipe>): string {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    const isEasyMealDay = easyMealDays.some(easyMealDate => easyMealDate.toDateString() === date.toDateString());
    const isTakeoutDay = takeoutDays.some(takeoutDate => takeoutDate.toDateString() === date.toDateString());

    const allRecipes = Object.values(recipes);
    const easyRecipes = allRecipes.filter(recipe => recipe.difficulty === Difficulty.Easy);
    const mediumRecipes = allRecipes.filter(recipe => recipe.difficulty === Difficulty.Medium);

    if (isTakeoutDay) {
        return "Takeout";
    }

    if (isEasyMealDay) {
        return getRandom(easyRecipes).name;
    }

    if (isWeekend) {
        return getRandom(allRecipes).name;
    }

    return getRandom(mediumRecipes).name;
}