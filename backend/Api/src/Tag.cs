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
        [Route("api/tag")]
        public class TagController : ControllerBase
        {
            private static readonly string _filePath = "data/tags.json";

            [HttpPost]
            public async Task<IActionResult> CreateTag(Tag tag)
            {
                var tags = await LoadTagsFromFileAsync();
                tags.Add(tag.Name, tag);
                await SaveTagsToFileAsync(tags);
                return CreatedAtAction(nameof(GetTag), new { name = tag.Name }, tag);
            }

            [HttpGet]
            public async Task<IActionResult> GetAllTags()
            {
                var tags = await LoadTagsFromFileAsync();
                return Ok(tags);
            }

            [HttpGet("{name}")]
            public async Task<IActionResult> GetTag(string name)
            {
                var tags = await LoadTagsFromFileAsync();
                if (tags.TryGetValue(name, out var tag))
                {
                    return Ok(tag);
                }
                else
                {
                    return NotFound();
                }
            }

            [HttpPut("{name}")]
            public async Task<IActionResult> UpdateTag(string name, Tag updatedTag)
            {
                var tags = await LoadTagsFromFileAsync();
                if (tags.TryGetValue(name, out var tag))
                {
                    tags.Remove(name);
                    tags.Add(updatedTag.Name, updatedTag);
                    await SaveTagsToFileAsync(tags);
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }

            [HttpDelete("{name}")]
            public async Task<IActionResult> DeleteTag(string name)
            {
                var tags = await LoadTagsFromFileAsync();
                if (tags.TryGetValue(name, out var tag))
                {
                    tags.Remove(name);
                    await SaveTagsToFileAsync(tags);
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }

            private static async Task<Dictionary<string, Tag>> LoadTagsFromFileAsync()
            {
                if (System.IO.File.Exists(_filePath))
                {
                    var json = await System.IO.File.ReadAllTextAsync(_filePath);
                    return JsonSerializer.Deserialize<Dictionary<string, Tag>>(json) ?? [];
                }
                else
                {
                    return [];
                }
            }

            private static async Task SaveTagsToFileAsync(Dictionary<string, Tag> tags)
            {
                var json = JsonSerializer.Serialize(tags);
                await System.IO.File.WriteAllTextAsync(_filePath, json);
            }
        }
    }

    public record Tag(string Name);
}