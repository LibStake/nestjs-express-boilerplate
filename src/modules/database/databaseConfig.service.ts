import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    public constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly loggerService: Logger,
    ) {}

    public createTypeOrmOptions(
        connectionName?: string,
    ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        const option: TypeOrmModuleOptions = {
            type: 'mariadb',
            host: this.configService.get('database.host'),
            port: this.configService.get('database.port'),
            username: this.configService.get('database.user'),
            password: this.configService.get('database.password'),
            database: this.configService.get('database.database'),
            synchronize:
                this.configService.get('database.synchronize') || false,
            dropSchema: this.configService.get('database.dropSchema') || false,
            namingStrategy: new SnakeNamingStrategy(),
            logging: this.configService.get('database.logging') || false,
            // Connect typeorm logger to server logger
            logger: this.configService.get('database.logging')
                ? new WinstonAdaptor(this.loggerService, 'all')
                : undefined,
            entities: [
                join(__dirname, '../**/entities/**/*{.entity.ts,.entity.js}'),
                join(__dirname, '../**/views/**/*{.view.ts,.view.js}'),
            ],
            migrations: [join(__dirname, 'seeds/*.seed{.js,.ts}')],
            poolSize: 10, // Default - 10
        };
        return option;
    }
}
