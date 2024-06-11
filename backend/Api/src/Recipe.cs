using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace RecipeRandomiser.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;
    using System.IO;
    using System.Text.Json;

    namespace RecipeRandomiser.Api.Controllers
    {
        [ApiController]
        [Route("api/recipe")]
        public class RecipeController : ControllerBase
        {
            private static readonly string _filePath = "data/recipes.json";

            [HttpPost]
            public IActionResult CreateRecipe(Recipe recipe)
            {
                var recipes = LoadRecipesFromFile();
                recipes[recipe.Name] = recipe;
                SaveRecipesToFile(recipes);
                return CreatedAtAction(nameof(GetRecipe), new { name = recipe.Name }, recipe);
            }

            [HttpGet]
            public IActionResult GetAllRecipes()
            {
                var recipes = LoadRecipesFromFile();
                return Ok(recipes);
            }

            [HttpGet("{name}")]
            public IActionResult GetRecipe(string name)
            {
                var recipes = LoadRecipesFromFile();
                if (recipes.TryGetValue(name, out var recipe))
                {
                    return Ok(recipe);
                }
                else
                {
                    return NotFound();
                }
            }

            [HttpPut("{name}")]
            public IActionResult UpdateRecipe(string name, Recipe updatedRecipe)
            {
                var recipes = LoadRecipesFromFile();
                if (recipes.ContainsKey(name))
                {
                    recipes[name] = updatedRecipe;
                    SaveRecipesToFile(recipes);
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }

            [HttpDelete("{name}")]
            public IActionResult DeleteRecipe(string name)
            {
                var recipes = LoadRecipesFromFile();
                if (recipes.Remove(name))
                {
                    SaveRecipesToFile(recipes);
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }

            private static Dictionary<string, Recipe> LoadRecipesFromFile()
            {
                if (System.IO.File.Exists(_filePath))
                {
                    var json = System.IO.File.ReadAllText(_filePath);
                    return JsonSerializer.Deserialize<Dictionary<string, Recipe>>(json) ?? [];
                }
                else
                {
                    return [];
                }
            }

            private static void SaveRecipesToFile(Dictionary<string, Recipe> recipes)
            {
                var json = JsonSerializer.Serialize(recipes);
                System.IO.File.WriteAllText(_filePath, json);
            }
        }
    }

    public record Recipe(string Name, List<IngredientWithAmount> Ingredients, uint Priority);
    public record IngredientWithAmount(string Ingredient, decimal Amount);
}