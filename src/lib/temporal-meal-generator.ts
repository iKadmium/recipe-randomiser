import { Temporal } from '@js-temporal/polyfill';
import { getDatabaseEntries, type Database } from './models/database';
import { Difficulty, type Recipe } from './models/recipe';
import { getRandomWithPenalty } from './temporal-util';

export interface MealDate {
    date: Temporal.PlainDate;
    meal?: string;
}

export function generateMeals(
    startDate: Temporal.PlainDate,
    endDate: Temporal.PlainDate,
    easyMealDays: Temporal.PlainDate[],
    takeoutDays: Temporal.PlainDate[],
    recipes: Database<Recipe>
): MealDate[] {
    const meals: MealDate[] = [];
    let currentDate = startDate;

    try {
        while (Temporal.PlainDate.compare(currentDate, endDate) <= 0) {
            const meal = getMealForDate(currentDate, easyMealDays, takeoutDays, recipes, meals);
            meals.push({ date: currentDate, meal });
            currentDate = currentDate.add({ days: 1 });
        }
    } catch (error) {
        console.error('Error generating meals:', error);
    }

    return meals;
}

export function getMealForDate(
    date: Temporal.PlainDate,
    easyMealDays: Temporal.PlainDate[],
    takeoutDays: Temporal.PlainDate[],
    recipes: Database<Recipe>,
    existingMeals: MealDate[]
): string | undefined {
    const dayOfWeek = date.dayOfWeek;
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 7; // Saturday or Sunday

    const isEasyMealDay = easyMealDays.some(
        (easyMealDate) => date.equals(easyMealDate)
    );
    const isTakeoutDay = takeoutDays.some(
        (takeoutDate) => date.equals(takeoutDate)
    );

    const allRecipes = getDatabaseEntries(recipes).map(([_, recipe]) => recipe);
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
        const mealDate = meal.date;
        const startOfWeek = date.subtract({ days: date.dayOfWeek - 1 });
        const endOfWeek = startOfWeek.add({ days: 6 });
        return Temporal.PlainDate.compare(mealDate, startOfWeek) >= 0 &&
            Temporal.PlainDate.compare(mealDate, endOfWeek) <= 0;
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
            const daysSince = date.since(meal.date).total('days');
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
