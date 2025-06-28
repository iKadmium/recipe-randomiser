# Scripts Directory

This directory contains utility scripts for the Recipe Randomiser project.

## Available Scripts

### `seed-netlify.js` / `seed-netlify.ts`

Migrates data from local Node.js filesystem (`data/` directory) to Netlify Blobs storage.

**Usage:**

```bash
# Run JavaScript version (recommended for production)
pnpm run seed:netlify

# Run TypeScript version (better for development/debugging)
pnpm run seed:netlify:ts

# Or run directly
node scripts/seed-netlify.js
# or
npx tsx scripts/seed-netlify.ts
```

**Requirements:**

- Must be run in a Netlify environment or with `NETLIFY_BLOBS_STORE_TOKEN` environment variable set
- Local data files must exist in the `data/` directory

**What it does:**

1. Reads all JSON files from the `data/` directory
2. Uploads each file's content to Netlify Blobs with the appropriate key
3. Verifies the upload was successful
4. Provides a summary of the migration

**Files migrated:**

- `data/recipes.json` → Netlify Blob key: `recipes`
- `data/ingredients.json` → Netlify Blob key: `ingredients`
- `data/tags.json` → Netlify Blob key: `tags`
- `data/takeout.json` → Netlify Blob key: `takeout`

**When to use:**

- Initial deployment to Netlify
- Migrating from local development to production
- Restoring data from backup

**Note:** This script should only be run once per environment setup. Running it multiple times will overwrite existing data in Netlify Blobs.
