import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { DatabaseModule } from './common/database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './common/health/health.module';

import serverConfig from '../configs/server.config';
import databaseConfig from '../configs/database.config';

@Module({
    imports: [
        // Import modules here
        LoggerModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'static'),
        }),
        DatabaseModule,
        HealthModule,
    ],
})
class NestedModule {}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [serverConfig, databaseConfig],
            // Set true on external environment injection
            // ignoreEnvFile: true,
            envFilePath: [
                'env/.env',
                'env/.env.development',
                'env/.env.default',
            ],
        }),
        NestedModule,
    ],
})
export class AppModule {}
