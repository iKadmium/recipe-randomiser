/**
 * TypeScript version of the Netlify seeding script
 * Provides better type safety and can be imported in other TS files
 */

import { readFile } from 'node:fs/promises';
import { getStore } from '@netlify/blobs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { config } from 'dotenv';
import type { Recipe } from '../src/lib/models/recipe.js';
import type { Ingredient } from '../src/lib/models/ingredient.js';
import type { Tag } from '../src/lib/models/tag.js';
import type { Takeout } from '../src/lib/models/takeout.js';
import type { Database } from '../src/lib/models/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: join(__dirname, '..', '.env') });

interface DataFileConfig {
    filename: string;
    key: string;
    description: string;
}

const DATA_FILES: DataFileConfig[] = [
    {
        filename: 'recipes.json',
        key: 'recipes',
        description: 'Recipe data with ingredients and cooking information'
    },
    {
        filename: 'ingredients.json',
        key: 'ingredients',
        description: 'Ingredient data with nutritional information'
    },
    {
        filename: 'tags.json',
        key: 'tags',
        description: 'Tags for categorizing recipes'
    },
    {
        filename: 'takeout.json',
        key: 'takeout',
        description: 'Takeout options and restaurant data'
    }
];

type DataType = Recipe | Ingredient | Tag | Takeout;

interface MigrationResult {
    filename: string;
    key: string;
    success: boolean;
    recordCount: number;
    error?: string;
}

interface MigrationSummary {
    results: MigrationResult[];
    successCount: number;
    errorCount: number;
    totalRecords: number;
}

/**
 * Read data from local JSON file with proper typing
 */
async function readLocalData<T extends DataType>(filename: string): Promise<Database<T>> {
    try {
        const filePath = join(__dirname, '..', 'data', filename);
        const contents = await readFile(filePath, { encoding: 'utf-8' });

        if (!contents.trim()) {
            console.warn(`⚠️  Empty file: ${filename}`);
            return {};
        }

        const data = JSON.parse(contents) as Database<T>;
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error reading ${filename}:`, errorMessage);
        return {};
    }
}

/**
 * Upload data to Netlify Blobs with error handling
 * Supports both production and dev environments
 */
async function uploadToNetlify<T extends DataType>(
    key: string,
    data: Database<T>
): Promise<void> {
    const isDev = process.env.NODE_ENV === 'development';
    const isNetlifyDev = process.env.NETLIFY_DEV === 'true' || process.env.CONTEXT === 'dev';
    const isLocalDev = process.env.RUNTIME_ENVIRONMENT === 'node' && isDev;

    // For local development, skip Netlify Blobs entirely
    if (isLocalDev) {
        console.log(`🏠 Local development mode - skipping Netlify Blobs upload for ${key}`);
        console.log(`📁 Data will be read directly from filesystem in development`);
        return;
    }

    const storeConfig: Parameters<typeof getStore>[0] = { name: 'data' };

    // Only add credentials for production - dev environment uses local Netlify dev
    if (!isDev && !isNetlifyDev && process.env.NETLIFY_SITE_ID && process.env.NETLIFY_BLOBS_STORE_TOKEN) {
        storeConfig.siteID = process.env.NETLIFY_SITE_ID;
        storeConfig.token = process.env.NETLIFY_BLOBS_STORE_TOKEN;
        console.log(`🔑 Using production credentials for site: ${process.env.NETLIFY_SITE_ID}`);
    } else if (isDev || isNetlifyDev) {
        console.log(`🏠 Using local Netlify dev environment (no credentials needed)`);
    } else {
        throw new Error('No credentials found for production environment');
    }

    const store = getStore(storeConfig);
    await store.set(key, JSON.stringify(data));
}

/**
 * Validate environment requirements
 */
function validateEnvironment(): void {
    const isDev = process.env.NODE_ENV === 'development';
    const isLocalDev = process.env.RUNTIME_ENVIRONMENT === 'node' && isDev;
    const isNetlifyDev = process.env.NETLIFY_DEV === 'true' || process.env.CONTEXT === 'dev';
    const isNetlifyEnv = process.env.RUNTIME_ENVIRONMENT === 'netlify';
    const hasProductionCreds = process.env.NETLIFY_SITE_ID && process.env.NETLIFY_BLOBS_STORE_TOKEN;

    // Debug: Show what environment variables are set
    console.log('🔍 Environment Debug Info:');
    console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
    console.log(`  RUNTIME_ENVIRONMENT: ${process.env.RUNTIME_ENVIRONMENT || 'undefined'}`);
    console.log(`  NETLIFY_DEV: ${process.env.NETLIFY_DEV || 'undefined'}`);
    console.log(`  CONTEXT: ${process.env.CONTEXT || 'undefined'}`);
    console.log(`  NETLIFY_SITE_ID: ${process.env.NETLIFY_SITE_ID ? '[SET]' : '[NOT SET]'}`);
    console.log(`  NETLIFY_BLOBS_STORE_TOKEN: ${process.env.NETLIFY_BLOBS_STORE_TOKEN ? '[SET]' : '[NOT SET]'}`);
    console.log('');

    if (isLocalDev) {
        console.log('🌍 Environment: Local Development (File System)');
        console.log('📁 Data will be read directly from local JSON files');
        console.log('💡 No Netlify Blobs seeding needed - your app will use the file system data source');
    } else if (isNetlifyEnv && (isNetlifyDev || process.env.CONTEXT === 'dev')) {
        console.log('🌍 Environment: Netlify Development (Local Netlify Dev)');
        console.log('⚠️  Netlify Blobs may not be fully configured in local dev environment');
        console.log('💡 Consider using the file system data source for development instead');
    } else if (hasProductionCreds) {
        console.log('🌍 Environment: Production');
        console.log(`🔑 Site ID: ${process.env.NETLIFY_SITE_ID}`);
    } else {
        throw new Error(
            '❌ No valid environment detected!\n' +
            'For production: Set NETLIFY_SITE_ID and NETLIFY_BLOBS_STORE_TOKEN\n' +
            'For development with Netlify Blobs: Use "netlify dev:exec" to run this script\n' +
            'For local development: Set RUNTIME_ENVIRONMENT=node NODE_ENV=development'
        );
    }
}

/**
 * Migrate a single data file
 */
async function migrateDataFile(config: DataFileConfig): Promise<MigrationResult> {
    const { filename, key, description } = config;

    try {
        console.log(`📄 Processing ${filename} (${description})...`);

        // Read local data
        const localData = await readLocalData(filename);
        const recordCount = Object.keys(localData).length;

        if (recordCount === 0) {
            console.log(`⚠️  No data found in ${filename}, skipping`);
            return {
                filename,
                key,
                success: true,
                recordCount: 0
            };
        }

        console.log(`📊 Found ${recordCount} records in ${filename}`);

        // Upload to Netlify Blobs
        await uploadToNetlify(key, localData);
        console.log(`✅ Uploaded ${key} to Netlify Blobs`);

        return {
            filename,
            key,
            success: true,
            recordCount
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Failed to process ${filename}:`, errorMessage);

        return {
            filename,
            key,
            success: false,
            recordCount: 0,
            error: errorMessage
        };
    }
}

/**
 * Main seeding function with comprehensive error handling
 */
export async function seedNetlifyBlobs(): Promise<MigrationSummary> {
    console.log('🌱 Starting Netlify Blobs seeding...\n');

    // Validate environment
    validateEnvironment();

    const isDev = process.env.NODE_ENV === 'development';
    const isLocalDev = process.env.RUNTIME_ENVIRONMENT === 'node' && isDev;
    const isNetlifyLocalDev = process.env.RUNTIME_ENVIRONMENT === 'netlify' && process.env.CONTEXT === 'dev';

    // For local development with Node.js backend, no seeding is needed
    if (isLocalDev) {
        console.log('✅ Local development with Node.js backend detected');
        console.log('📁 Your app reads directly from data/*.json files');
        console.log('🎉 No seeding required - your data is already available!\n');

        // Return a summary showing the data files that exist
        const results: MigrationResult[] = [];
        for (const config of DATA_FILES) {
            const localData = await readLocalData(config.filename);
            const recordCount = Object.keys(localData).length;

            results.push({
                filename: config.filename,
                key: config.key,
                success: true,
                recordCount
            });

            console.log(`📊 ${config.filename}: ${recordCount} records available`);
        }

        const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);

        return {
            results,
            successCount: results.length,
            errorCount: 0,
            totalRecords
        };
    }

    // For Netlify local dev without proper Blobs configuration
    if (isNetlifyLocalDev && !process.env.NETLIFY_SITE_ID) {
        console.log('⚠️  Netlify local dev environment detected but Netlify Blobs not configured');
        console.log('💡 For development, consider using the file system data source instead');
        console.log('🔧 Set RUNTIME_ENVIRONMENT=node in your .env file for local development\n');

        // Return a summary showing the data files that exist without trying to seed Blobs
        const results: MigrationResult[] = [];
        for (const config of DATA_FILES) {
            const localData = await readLocalData(config.filename);
            const recordCount = Object.keys(localData).length;

            results.push({
                filename: config.filename,
                key: config.key,
                success: true,
                recordCount
            });

            console.log(`📊 ${config.filename}: ${recordCount} records available (file system)`);
        }

        const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);

        return {
            results,
            successCount: results.length,
            errorCount: 0,
            totalRecords
        };
    }

    const results: MigrationResult[] = [];

    // Process each data file for Netlify Blobs
    for (const config of DATA_FILES) {
        const result = await migrateDataFile(config);
        results.push(result);
        console.log(''); // Empty line for readability
    }

    // Calculate summary
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;
    const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);

    const summary: MigrationSummary = {
        results,
        successCount,
        errorCount,
        totalRecords
    };

    // Print summary
    console.log('📋 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} files`);
    console.log(`❌ Failed migrations: ${errorCount} files`);
    console.log(`📊 Total records migrated: ${totalRecords}`);

    if (errorCount > 0) {
        console.log('\n⚠️  Some migrations failed:');
        results
            .filter(r => !r.success)
            .forEach(r => console.log(`   - ${r.filename}: ${r.error}`));
    } else {
        console.log('\n🎉 All data successfully migrated to Netlify Blobs!');
        console.log('💡 You can now use the Netlify Blobs data source in production.');
    }

    return summary;
}

/**
 * Verify data after seeding with detailed reporting
 */
export async function verifyNetlifyData(): Promise<boolean> {
    console.log('\n🔍 Verifying uploaded data...\n');

    const isDev = process.env.NODE_ENV === 'development';
    const isNetlifyDev = process.env.NETLIFY_DEV === 'true' || process.env.CONTEXT === 'dev';
    const isLocalDev = process.env.RUNTIME_ENVIRONMENT === 'node' && isDev;
    const isNetlifyLocalDev = process.env.RUNTIME_ENVIRONMENT === 'netlify' && process.env.CONTEXT === 'dev';

    // For local development, skip verification since we're not using Netlify Blobs
    if (isLocalDev || (isNetlifyLocalDev && !process.env.NETLIFY_SITE_ID)) {
        console.log('🏠 Local development mode - skipping Netlify Blobs verification');
        console.log('📁 Your app will read data directly from the filesystem');
        return true;
    }

    const storeConfig: Parameters<typeof getStore>[0] = { name: 'data' };

    // Only add credentials for production - dev environment uses local Netlify dev
    if (!isDev && !isNetlifyDev && process.env.NETLIFY_SITE_ID && process.env.NETLIFY_BLOBS_STORE_TOKEN) {
        storeConfig.siteID = process.env.NETLIFY_SITE_ID;
        storeConfig.token = process.env.NETLIFY_BLOBS_STORE_TOKEN;
    }

    const store = getStore(storeConfig);
    let allValid = true;

    for (const config of DATA_FILES) {
        const { key } = config;

        try {
            const data = await store.get(key, { type: 'text' });

            if (data) {
                const parsed = JSON.parse(data as string);
                const recordCount = Object.keys(parsed).length;
                console.log(`✅ ${key}: ${recordCount} records verified`);
            } else {
                console.log(`❌ ${key}: No data found`);
                allValid = false;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log(`❌ ${key}: Error verifying - ${errorMessage}`);
            allValid = false;
        }
    }

    return allValid;
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    try {
        const isDev = process.env.NODE_ENV === 'development';
        const isNetlifyDev = process.env.NETLIFY_DEV === 'true' || process.env.CONTEXT === 'dev';
        const isLocalDev = process.env.RUNTIME_ENVIRONMENT === 'node' && isDev;

        // Safety check for development mode
        if (isLocalDev) {
            console.log('🚨 LOCAL DEVELOPMENT MODE DETECTED');
            console.log('📍 This will check your local data files only');
            console.log('💡 No Netlify Blobs operations will be performed\n');
        } else if (isDev || isNetlifyDev) {
            console.log('🚨 NETLIFY DEVELOPMENT MODE DETECTED');
            console.log('📍 This will seed your LOCAL Netlify dev environment only');
            console.log('💡 Make sure "netlify dev" is running\n');
        } else {
            console.log('🚨 PRODUCTION MODE DETECTED');
            console.log('📍 This will seed your LIVE production database');
            console.log('⚠️  Make sure this is what you want!\n');
        }

        const summary = await seedNetlifyBlobs();
        const isValid = await verifyNetlifyData();

        if (summary.errorCount > 0 || !isValid) {
            console.error('\n💥 Seeding completed with errors');
            process.exit(1);
        }

        console.log('\n🎉 Seeding completed successfully!');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('\n💥 Seeding failed:', errorMessage);
        process.exit(1);
    }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
