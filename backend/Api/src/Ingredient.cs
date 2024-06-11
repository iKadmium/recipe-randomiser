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
        [Route("api/ingredient")]
        public class IngredientController : ControllerBase
        {
            private static readonly string _filePath = "data/ingredients.json";

            [HttpPost]
            public async Task<IActionResult> CreateIngredient(Ingredient ingredient)
            {
                var ingredients = await LoadIngredientsFromFileAsync();
                ingredients.Add(ingredient.Name, ingredient);
                await SaveIngredientsToFileAsync(ingredients);
                return CreatedAtAction(nameof(GetIngredient), new { name = ingredient.Name }, ingredient);
            }

            [HttpGet]
            public async Task<IActionResult> GetAllIngredients()
            {
                var ingredients = await LoadIngredientsFromFileAsync();
                return Ok(ingredients);
            }

            [HttpGet("{name}")]
            public async Task<IActionResult> GetIngredient(string name)
            {
                var ingredients = await LoadIngredientsFromFileAsync();
                if (ingredients.TryGetValue(name, out var ingredient))
                {
                    return Ok(ingredient);
                }
                else
                {
                    return NotFound();
                }
            }

            [HttpPut("{name}")]
            public async Task<IActionResult> UpdateIngredient(string name, Ingredient updatedIngredient)
            {
                var ingredients = await LoadIngredientsFromFileAsync();
                if (ingredients.TryGetValue(name, out var ingredient))
                {
                    ingredients.Remove(name);
                    ingredients.Add(updatedIngredient.Name, updatedIngredient);
                    await SaveIngredientsToFileAsync(ingredients);
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }

            [HttpDelete("{name}")]
            public async Task<IActionResult> DeleteIngredient(string name)
            {
                var ingredients = await LoadIngredientsFromFileAsync();
                if (ingredients.TryGetValue(name, out var ingredient))
                {
                    ingredients.Remove(name);
                    await SaveIngredientsToFileAsync(ingredients);
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }

            private static async Task<Dictionary<string, Ingredient>> LoadIngredientsFromFileAsync()
            {
                if (System.IO.File.Exists(_filePath))
                {
                    var json = await System.IO.File.ReadAllTextAsync(_filePath);
                    return JsonSerializer.Deserialize<Dictionary<string, Ingredient>>(json) ?? [];
                }
                else
                {
                    return [];
                }
            }

            private static async Task SaveIngredientsToFileAsync(Dictionary<string, Ingredient> ingredients)
            {
                var json = JsonSerializer.Serialize(ingredients);
                await System.IO.File.WriteAllTextAsync(_filePath, json);
            }
        }
    }

    public record Ingredient(string Name, string Unit);
}