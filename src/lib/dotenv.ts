import { config } from 'dotenv';
import { logger } from './server/logger';
import { env } from '$env/dynamic/private'

// Load .env files from root directory
export async function loadEnv() {
    logger.info(`Loading .env file`);
    logger.info(`Environment: ${env.NODE_ENV}`);

    config();

    if (env.NODE_ENV == "production")
    {
        config({ path: '.env.prod' });
    }
    else 
    {
        config({ path: '.env.dev' });
    }

    logger.info(`Server Port: ${env.DB_NAME}`);
}