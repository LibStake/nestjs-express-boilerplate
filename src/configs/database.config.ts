import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE_NAME,
    synchronize: (process.env.DATABASE_SYNC ?? '').toLowerCase() === 'true',
    dropSchema:
        (process.env.DATABASE_DROP_SCHEMA ?? '').toLowerCase() === 'true',
    logging: (process.env.DATABASE_LOGGING ?? '').toLowerCase() === 'true',
}));
